#
# This is the server logic of a Shiny web application. You can run the
# application by clicking 'Run App' above.
#
# Find out more about building applications with Shiny here:
#
#    http://shiny.rstudio.com/
#

library(shiny)
library(rsconnect)
library(lubridate)
library(dplyr)
library(ggplot2)
library(ggpubr)

proc_data <- function(path) {
  dat <- subset(read.csv(file=path), select = -c(to))
  dat$from <- as.character(dat$from)
  dat$timestamp <- as.POSIXct(dat$timestamp, "%Y-%m-%d %H:%M:%S", tz = "")
  
  return(dat)
}

fri_combined <- proc_data("../outputs/comm-data-Fri.csv")
sat_combined <- proc_data("../outputs/comm-data-Sat.csv")
sun_combined <- proc_data("../outputs/comm-data-Sun.csv")

# Define server logic
shinyServer(function(input, output) {
  
  ## get the string version of the dataset input name
  base <- reactive({get(input$data)})  
  
    ## first plot tab
    output$p1 <- renderPlot({
      
      ## save the data frame into a variable
      mydata <- base()
      
      res <- mydata %>%
        filter(hour(mydata$timestamp) == input$time_slot & location %in% input$location) %>%
        group_by(from, location) %>%
        summarise(msg_freq = sum(to_num), .groups = 'keep') %>%
        arrange(desc(msg_freq)) %>%
        head(20)
      
      a <- ggplot(data = res,
                  mapping = aes(x = reorder(from, msg_freq), 
                                y = msg_freq,
                                fill = location)) +
        geom_col() +
        labs(x = "Sender UID", 
             y = "Message Frequency",
             fill = "Location",
             title = "Message Frequency by Sender UID") +
        theme(plot.title = element_text(hjust = 0.5),
              panel.background = element_blank(),
              axis.line = element_line(colour = "black")) + 
        scale_y_log10() +
        coord_flip() +
        geom_text(aes(label = msg_freq), size = 3, hjust = 1.2)
      
      res_pie <- subset(res, select = -c(from)) %>%
        group_by(location) %>%
        summarise(msg_freq = sum(msg_freq), .groups = 'keep')
      
      b <- ggplot(data = res_pie, 
                  aes(x = "", 
                      y = msg_freq, 
                      fill = location)) +
        geom_bar(aes(fill = location), stat = "identity", width = 1) +
        coord_polar("y", start = 0) +
        labs(fill = "Location",
             title = "Message Frequency by Location") + 
        geom_text(aes(label = msg_freq), position = position_stack(vjust = 0.5)) +
        theme(axis.title = element_blank(),
              axis.text = element_blank(),
              axis.ticks = element_blank(),
              panel.background = element_blank(),
              plot.title = element_text(hjust = 0.5))
      
      output_plot <- ggarrange(a, b, common.legend = TRUE, legend = "bottom")
      
      annotate_figure(output_plot, top = text_grob("Message Frequency (Sender)",
                                                   face = "bold",
                                                   size = 20))

    })
    


})

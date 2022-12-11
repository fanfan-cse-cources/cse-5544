#
# This is the server logic of a Shiny web application. You can run the
# application by clicking 'Run App' above.
#
# Find out more about building applications with Shiny here:
#
#    http://shiny.rstudio.com/
#

library(shiny)
library(plotly)
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
  
    ## first plot tab
    output$p1 <- renderPlot({
      
      ## get the string version of the dataset input name
      base <- reactive({get(input$data)})

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
             title = "Overall Message Frequency by Location") + 
        geom_text(aes(label = msg_freq), position = position_stack(vjust = 0.5)) +
        theme(axis.title = element_blank(),
              axis.text = element_blank(),
              axis.ticks = element_blank(),
              panel.background = element_blank(),
              plot.title = element_text(hjust = 0.5))
      
        ggarrange(a, b, common.legend = TRUE, legend = "bottom")
    })
    
    ## second plot tab
    output$p2 <- renderPlot({
      
      ## get the string version of the dataset input name
      base <- reactive({get(input$dataset)})
      
      ## save the data frame into a variable
      mydata <- base()
      
      res_heat <- mydata %>%
        group_by(hour, location) %>%
        mutate(msg_freq = sum(to_num), .groups = 'keep') %>%
        select(hour, location, msg_freq)
      
      ggplot(res_heat, aes(x = as.factor(hour), y = location)) +
        geom_tile(aes(fill = msg_freq)) +
        scale_fill_gradientn(colors = hcl.colors(20, "YlGn")) +
        guides(fill = guide_colourbar(barwidth = 1.5,
                                      barheight = 7.5)) +
        coord_equal() + 
        theme(panel.background = element_blank(),
              axis.line = element_line(colour = "black"),
              plot.title = element_text(hjust = 0.5)) +
        labs(x = "Hour",
             y = "Location",
             fill = "Msg. Freq.",
             title = "Message Frequency by Location")
    })
    
    ## third plot tab
    output$p3 <- renderPlotly({
      
      freq_calculator <- function(data, workday){
        output <- data %>%
          mutate(hour = hour(timestamp)) %>%
          select(to_num, hour, to_ext) %>%
          group_by(hour) %>%
          mutate(freq = sum(to_num)) %>%
          mutate(int_freq = sum(to_num) - sum(to_ext)) %>%
          mutate(ext_freq = sum(to_ext)) %>%
          select(-to_num) %>%
          filter(!duplicated(hour)) %>%
          mutate(weekday = rep(workday, length(hour)))
        
        return(output)
      }
      
      friday_freq <- freq_calculator(fri_combined, "Friday")
      saturday_freq <- freq_calculator(sat_combined, "Saturday")
      sunday_freq <- freq_calculator(sun_combined, "Sunday")
      
      combined_freq <- rbind(friday_freq, saturday_freq, sunday_freq)
      
      combined_freq <- combined_freq %>%
        filter(weekday %in% input$weekday)
      
      plot_3 <- ggplot(combined_freq, aes(x = hour, y = freq, 
                                          group = weekday, color = weekday,
                                          text = paste("Hour: ", hour, "<br>",
                                                       "Frequency: ", freq, "<br>",
                                                       "Int. Frequency: ", int_freq, "<br>",
                                                       "Ext. Frequency: ", ext_freq, "<br>",
                                                       "Day: ", weekday, sep = ""))) +
        geom_line() +
        scale_x_continuous(breaks = c(8:23)) +
        labs(x = "Hour",
             y = "Message Frequency",
             color = "Work Day", 
             title = "Message Frequency by Hour") +
        theme(plot.title = element_text(hjust = 0.5),
              panel.background = element_blank(),
              axis.line = element_line(colour = "black"))
      
      ggplotly(plot_3, tooltip = c("text"))
    })


})

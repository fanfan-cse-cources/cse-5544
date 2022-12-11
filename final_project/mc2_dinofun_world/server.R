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

# Define server logic
## what need to be shiny: time_slot
shinyServer(function(input, output) {

    output$p1 <- renderPlot({
      location_filter <- c('Coaster Alley', 'Entry Corridor', 'Kiddie Land', 'Tundra Land', 'Wet Land')
      res <- fri_combined %>%
        filter(hour(fri_combined$timestamp) == input$time_slot & location %in% location_filter) %>%
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
             title = "Message Frequency by Locations/Hours (Sender)") +
        scale_y_log10() +
        coord_flip() +
        geom_text(aes(label = msg_freq), size = 3, hjust = 1.2)
      
      res_pie <- subset(res, select = -c(from)) %>%
        group_by(location) %>%
        summarise(msg_freq = sum(msg_freq), .groups = 'keep')
      
      b <- ggplot(data = res_pie, aes(x = "", y = location, fill = location)) +
        geom_bar(stat="identity", width=1) +
        coord_polar("y", start=0) +
        labs(fill = "Location", title = "Location of Most Frequent Messages") + 
        geom_text(aes(label = msg_freq), position = position_stack(vjust = 0.5)) +
        theme_void()
      
      ggarrange(a, b,
                common.legend = TRUE, legend = "bottom")

    })
    


})

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

fri_combined <- read.csv(file="../outputs/comm-data-Fri.csv")
fri_combined <- subset(fri_combined, select = -c(to))
fri_combined$from <- as.character(fri_combined$from)
fri_combined$timestamp <- as.POSIXct(fri_combined$timestamp, "%Y-%m-%d %H:%M:%S", tz = "")

# Define server logic
## what need to be shiny: time_slot
shinyServer(function(input, output) {

    output$p1 <- renderPlot({
      
      res <- fri_combined %>%
        filter(hour(fri_combined$timestamp) == input$time_slot & location %in% location_filter) %>%
        group_by(from, location) %>%
        summarise(msg_freq = sum(to_num), .groups = 'keep') %>%
        arrange(desc(msg_freq)) %>%
        head(20)
      
      ggplot(data = res,
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

    })

})

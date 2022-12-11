#
# This is the user-interface definition of a Shiny web application. You can
# run the application by clicking 'Run App' above.
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

# Define UI for application that draws a histogram
shinyUI(fluidPage(

    # Application title
    titlePanel(""),

    # Sidebar with a slider input for number of bins
    sidebarLayout(
        sidebarPanel(
            sliderInput("time_slot",
                        "Time slots:",
                        min = 8,
                        max = 23,
                        value = 8,
                        step = 1),

            checkboxGroupInput("location",
                               "Choose locations:",
                               c("Coaster Alley", "Entry Corridor", 
                                 "Kiddie Land", "Tundra Land", "Wet Land"))
        ),

        # Show a plot of the generated distribution
        mainPanel(
            plotOutput("p1")
        )
    )
))

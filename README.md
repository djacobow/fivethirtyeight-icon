# 538 Election Status Icon 

Simple Chrome extension to take the 2016 Nate Silver presidential
election model output and put it in in a tiny icon in your Chrome
toolbar.

It's also not a bad example of the very minimum it takes to make 
a useful Chrome Extension with a "browser action."

## How does it work?

A background script periodically hits the FiveThirtyEight website 
and pulls down a page containing results data. From that, it scrapes
out the top-level predictions for each candidate, updates the status
icon, and stores them.

If the user clicks on the status icon, a bit more of the results are 
shown in a popup.

## Author

Dave Jacobowitz
david.jacobowitz@gmail.com

## Version

0.0.6

## Date

October, 2016

@echo off

call :runBot

:getInput
    echo Bot has failed.
    echo Options:
    echo 1. Exit
    echo 2. Run again
    set /p option = What do you want to do [1, 2]? 
    if %option% == 1:
        call :exit
    if %option% == 2:
        call :runBot
    
:runBot
    node src/hopson_bot.js
    call :getInput

:exit
    pause
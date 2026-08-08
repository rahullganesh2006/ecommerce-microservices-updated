@echo off
echo ====================================================
echo      AngadiHub Backend Lambda Packaging Tool        
echo ====================================================

set SERVICES=product-service cart-service inventory-service order-service payment-service

if exist lambda_packages rmdir /s /q lambda_packages
mkdir lambda_packages

for %%s in (%SERVICES%) do (
    echo.
    echo ----------------------------------------------------
    echo Building Lambda Package for: %%s
    echo ----------------------------------------------------
    
    cd %%s
    
    if exist lambda_build rmdir /s /q lambda_build
    mkdir lambda_build
    
    echo Installing Linux-compatible dependencies...
    pip install ^
      --platform manylinux2014_x86_64 ^
      --target lambda_build ^
      --implementation cp ^
      --python-version 3.12 ^
      --only-binary=:all: ^
      --upgrade ^
      -r requirements_lambda.txt
      
    echo Copying application files...
    if exist app.py copy /Y app.py lambda_build\
    if exist database.py copy /Y database.py lambda_build\
    if exist security.py copy /Y security.py lambda_build\
    
    if exist routers xcopy /E /I /Y routers lambda_build\routers\
    if exist schemas xcopy /E /I /Y schemas lambda_build\schemas\
    if exist services xcopy /E /I /Y services lambda_build\services\
    if exist repositories xcopy /E /I /Y repositories lambda_build\repositories\
    if exist clients xcopy /E /I /Y clients lambda_build\clients\
    
    echo Compressing deployment package...
    cd lambda_build
    powershell -command "Compress-Archive -Path * -DestinationPath ..\lambda_package.zip -Force"
    cd ..
    
    copy /Y lambda_package.zip ..\lambda_packages\%%s.zip
    
    echo Cleaning up build directory...
    rmdir /s /q lambda_build
    
    cd ..
    echo Done packaging %%s!
)

echo.
echo ====================================================
echo All packages are built and ready in: lambda_packages\
echo ====================================================

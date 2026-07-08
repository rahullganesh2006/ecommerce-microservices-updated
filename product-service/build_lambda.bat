@echo off
echo Cleaning previous build...
if exist lambda_build rmdir /s /q lambda_build
if exist lambda_package.zip del lambda_package.zip

echo Installing Linux-compatible dependencies...
mkdir lambda_build

pip install ^
  --platform manylinux2014_x86_64 ^
  --target lambda_build ^
  --implementation cp ^
  --python-version 3.12 ^
  --only-binary=:all: ^
  --upgrade ^
  -r requirements_lambda.txt

echo Copying application code...
xcopy /E /I /Y app.py lambda_build\
xcopy /E /I /Y database.py lambda_build\
xcopy /E /I /Y routers lambda_build\routers\
xcopy /E /I /Y schemas lambda_build\schemas\
xcopy /E /I /Y services lambda_build\services\
xcopy /E /I /Y repositories lambda_build\repositories\

echo Creating zip...
cd lambda_build
powershell -command "Compress-Archive -Path * -DestinationPath ..\lambda_package.zip -Force"
cd ..

echo Done! Upload lambda_package.zip to AWS Lambda.

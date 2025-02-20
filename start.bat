@echo off
echo 正在启动作业管理系统...

REM 创建MongoDB数据目录
if not exist "%USERPROFILE%\data\db" (
    echo 创建MongoDB数据目录...
    mkdir "%USERPROFILE%\data\db"
)

REM 启动MongoDB服务
echo 正在启动MongoDB服务...
start "MongoDB" "C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe" --dbpath="%USERPROFILE%\data\db"

REM 等待MongoDB完全启动
timeout /t 5 /nobreak

REM 启动Node.js应用
echo 正在启动Node.js应用...
npm run dev

REM 如果Node.js应用停止运行，保持窗口打开
pause
@echo off
chcp 65001 >nul
echo ============================================================
echo OVH Phantom Sniper - 快速配置
echo ============================================================
echo.

echo [1/3] 生成安全密钥...
cd backend

python -c "import secrets; print(secrets.token_urlsafe(32))" > temp_key.txt
set /p SECRET_KEY=<temp_key.txt
del temp_key.txt

echo.
echo ✅ 密钥已生成: %SECRET_KEY%
echo.

echo [2/3] 创建配置文件...
(
echo # OVH Phantom Sniper - 后端配置文件
echo # API 安全密钥
echo API_SECRET_KEY=%SECRET_KEY%
echo.
echo # 应用配置
echo PORT=5000
echo DEBUG=false
echo ENABLE_API_KEY_AUTH=true
) > .env

echo ✅ 配置文件已创建: backend\.env
echo.

echo [3/3] 完成！
echo.
echo ============================================================
echo 配置完成！下一步：
echo ============================================================
echo.
echo 1. 启动后端:
echo    cd backend
echo    pip install -r requirements.txt
echo    python app.py
echo.
echo 2. 启动前端（新窗口）:
echo    npm run dev
echo.
echo 3. 打开浏览器 http://localhost:5173/settings
echo    在【网站安全密钥】输入: %SECRET_KEY%
echo.
echo ⚠️  重要：请复制上面的密钥到前端设置页面！
echo.
echo ============================================================

cd ..
pause


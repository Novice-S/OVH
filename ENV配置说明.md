# 📝 .env 配置文件说明

## 🎯 必须配置的项目

在 `backend/.env` 文件中，**只需要配置以下内容**：

---

## ✅ 核心配置

### 1. API_SECRET_KEY（必须）

**用途：** 用于验证前后端通信，防止未授权访问

**配置方法：**

```env
API_SECRET_KEY=your-generated-secret-key-here
```

**生成密钥：**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

**示例输出：**
```
xK9mP2vN_8dQ4rT6wY1zA3bC5eF7gH9jL0mN2pR4sT6v
```

**⚠️ 重要提示：**
- 生产环境必须使用强随机密钥（至少32字符）
- 这个密钥需要在前端设置页面输入相同的值
- 不要泄露或分享此密钥

---

### 2. PORT（可选）

**用途：** 后端运行端口

**默认值：** 5000

**配置：**
```env
PORT=5000
```

如果端口被占用，可以改为其他端口（如 5001, 8000等）

---

### 3. DEBUG（可选）

**用途：** 是否启用调试模式

**默认值：** false

**配置：**
```env
# 开发环境
DEBUG=true

# 生产环境
DEBUG=false
```

**建议：**
- 开发环境：`true`（方便调试）
- 生产环境：`false`（性能更好）

---

### 4. ENABLE_API_KEY_AUTH（可选）

**用途：** 是否启用API密钥验证

**默认值：** true

**配置：**
```env
ENABLE_API_KEY_AUTH=true
```

**建议：** 保持开启以确保安全性

---

## 📄 完整的 .env 文件示例

### 最小配置（推荐）

```env
# API 安全密钥（必须修改）
API_SECRET_KEY=ovh-phantom-sniper-2024-secret-key

# 应用配置
PORT=5000
DEBUG=false
ENABLE_API_KEY_AUTH=true
```

### 完整配置（带注释）

```env
# ==============================================
# OVH Phantom Sniper - 后端配置文件
# ==============================================

# ==================== 必须配置 ====================

# API 安全密钥
# 生成命令: python -c "import secrets; print(secrets.token_urlsafe(32))"
API_SECRET_KEY=ovh-phantom-sniper-2024-secret-key

# ==================== 应用配置 ====================

# 后端端口
PORT=5000

# 调试模式（生产环境设为 false）
DEBUG=false

# 启用API密钥验证
ENABLE_API_KEY_AUTH=true

# ==================== 可选配置 ====================

# CORS 允许的来源（如果需要自定义）
# ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

---

## 🔍 不需要在 .env 配置的内容

以下内容在**前端设置页面**配置，不需要在 .env 中设置：

- ❌ OVH API 凭据（APP_KEY, APP_SECRET, CONSUMER_KEY）
- ❌ Telegram 配置（TG_TOKEN, TG_CHAT_ID）
- ❌ 区域设置（ZONE, IAM）

这些都可以在浏览器的设置页面中配置！

---

## 🚀 快速设置步骤

### 1. 创建 .env 文件

```bash
cd backend
cp env_example.txt .env
```

### 2. 生成并设置密钥

```bash
# 生成密钥
python -c "import secrets; print(secrets.token_urlsafe(32))"

# 复制输出，编辑 .env 文件
nano .env  # 或使用其他编辑器
```

将生成的密钥粘贴到 `API_SECRET_KEY=` 后面

### 3. 保存文件

确保 .env 文件内容类似：

```env
API_SECRET_KEY=xK9mP2vN_8dQ4rT6wY1zA3bC5eF7gH9jL0mN2pR4sT6v
PORT=5000
DEBUG=false
ENABLE_API_KEY_AUTH=true
```

### 4. 验证配置

```bash
# 检查 .env 文件
cat .env

# 启动后端（如果成功启动说明配置正确）
python app.py
```

---

## 📋 配置检查清单

- [ ] 创建了 `backend/.env` 文件
- [ ] 设置了 `API_SECRET_KEY`（不是默认值）
- [ ] 生产环境设置了 `DEBUG=false`
- [ ] 确认 `ENABLE_API_KEY_AUTH=true`
- [ ] `.env` 文件不在 Git 中（已在 .gitignore）

---

## 🔐 安全建议

### 开发环境

```env
API_SECRET_KEY=dev-key-for-testing
PORT=5000
DEBUG=true
```

### 生产环境

```env
API_SECRET_KEY=<64字符的超强随机密钥>
PORT=5000
DEBUG=false
```

**生成超强密钥：**
```bash
python -c "import secrets; print(secrets.token_urlsafe(48))"
```

---

## ⚡ 一键生成配置文件

```bash
cd backend

# 自动生成包含随机密钥的 .env 文件
cat > .env << EOF
API_SECRET_KEY=$(python -c "import secrets; print(secrets.token_urlsafe(32))")
PORT=5000
DEBUG=false
ENABLE_API_KEY_AUTH=true
EOF

# 查看生成的密钥
cat .env
```

---

## 📚 后续步骤

1. ✅ 创建 `.env` 文件
2. ✅ 生成并设置密钥
3. ⏭️ 启动后端：`python app.py`
4. ⏭️ 启动前端：`npm run dev`
5. ⏭️ 打开设置页面配置密钥

---

**就这么简单！** 🎉

只需要一个 `.env` 文件，配置一个密钥，就可以安全运行了！


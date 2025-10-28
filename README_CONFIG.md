# 📖 配置说明

## 🎯 配置方式改进

### ✨ 现在的配置方式（简单安全）

1. **后端配置** - 在 `backend/.env` 文件中设置 API_SECRET_KEY
2. **前端配置** - 在设置页面输入相同的 API_SECRET_KEY

就这么简单！✨

---

## 🔧 详细步骤

### 1. 创建后端配置文件

```bash
cd backend
cp .env.example .env
```

### 2. 编辑 .env 文件

```env
# 生成一个安全的密钥
API_SECRET_KEY=<生成的随机密钥>
```

**生成密钥命令：**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 3. 安装依赖并启动后端

```bash
cd backend
pip install -r requirements.txt
python app.py
```

### 4. 启动前端

```bash
npm run dev
```

### 5. 在浏览器中配置

1. 访问 `http://localhost:5173`
2. 进入 **设置** 页面
3. 在 **网站安全密钥** 处输入与 `.env` 文件相同的密钥
4. 填写 OVH API 凭据
5. 保存

---

## 🔐 安全密钥流程

```
┌─────────────────┐
│  backend/.env   │
│  API_SECRET_KEY │
│  ↓ (复制)       │
└─────────────────┘
        ↓
┌─────────────────┐
│  设置页面       │
│  输入密钥       │
│  ↓ (保存)       │
└─────────────────┘
        ↓
┌─────────────────┐
│  localStorage   │
│  密钥存储       │
└─────────────────┘
        ↓
┌─────────────────┐
│  apiClient.ts   │
│  自动添加到请求 │
└─────────────────┘
        ↓
┌─────────────────┐
│  后端验证       │
│  检查密钥匹配   │
└─────────────────┘
```

---

## ✅ 优势

1. **简单** - 只需配置一个密钥
2. **安全** - 密钥不在前端代码中
3. **灵活** - 修改密钥无需重新构建
4. **统一** - 所有配置在一个地方

---

## 📝 文件说明

### 后端文件

- `backend/.env` - 配置文件（需要创建）
- `backend/.env.example` - 配置示例
- `backend/api_key_config.py` - 密钥验证配置

### 前端文件

- `src/utils/apiClient.ts` - API 客户端（读取 localStorage）
- `src/pages/SettingsPage.tsx` - 设置页面（输入密钥）
- `src/config/constants.ts` - 常量定义（不含敏感信息）

---

## 🎉 完成效果

- ✅ API_SECRET_KEY 不在前端代码中
- ✅ 用户在设置页面配置
- ✅ 密钥存储在 localStorage
- ✅ 后端从 .env 读取验证
- ✅ 安全且灵活

---

**更新日期：** 2024-10-28  
**版本：** 2.1.0


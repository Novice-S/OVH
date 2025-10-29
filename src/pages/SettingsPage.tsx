import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAPI } from "@/context/APIContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { CacheManager } from "@/components/CacheManager";
import { useIsMobile } from "@/hooks/use-mobile";
import { getApiSecretKey, setApiSecretKey } from "@/utils/apiClient";

const SettingsPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { 
    appKey, 
    appSecret, 
    consumerKey, 
    endpoint,
    tgToken,
    tgChatId,
    iam,
    zone,
    isLoading,
    isAuthenticated,
    setAPIKeys,
    checkAuthentication
  } = useAPI();

  const [formValues, setFormValues] = useState({
    apiSecretKey: "",
    appKey: "",
    appSecret: "",
    consumerKey: "",
    endpoint: "ovh-eu",
    tgToken: "",
    tgChatId: "",
    iam: "go-ovh-ie",
    zone: "IE"
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showValues, setShowValues] = useState({
    apiSecretKey: false,
    appKey: false,
    appSecret: false,
    consumerKey: false,
    tgToken: false
  });

  // Load current values when component mounts
  useEffect(() => {
    setFormValues({
      apiSecretKey: getApiSecretKey() || "",
      appKey: appKey || "",
      appSecret: appSecret || "",
      consumerKey: consumerKey || "",
      endpoint: endpoint || "ovh-eu",
      tgToken: tgToken || "",
      tgChatId: tgChatId || "",
      iam: iam || "go-ovh-ie",
      zone: zone || "IE"
    });
  }, [appKey, appSecret, consumerKey, endpoint, tgToken, tgChatId, iam, zone]);

  // Auto-update IAM when zone changes
  useEffect(() => {
    if (formValues.zone) {
      setFormValues(prev => ({
        ...prev,
        iam: `go-ovh-${formValues.zone.toLowerCase()}`
      }));
    }
  }, [formValues.zone]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  // Toggle password visibility
  const toggleShowValue = (field: keyof typeof showValues) => {
    setShowValues({
      ...showValues,
      [field]: !showValues[field]
    });
  };

  // Save settings
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate API Secret Key
    if (!formValues.apiSecretKey) {
      toast.error("请设置网站安全密钥");
      return;
    }
    
    setIsSaving(true);
    try {
      // 1. 先保存网站安全密钥到 localStorage（这个总是要保存的）
      setApiSecretKey(formValues.apiSecretKey);
      
      // 等待一下确保 localStorage 写入完成
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 2. 检查是否填写了 OVH API 配置
      const hasOVHConfig = formValues.appKey && formValues.appSecret && formValues.consumerKey;
      
      if (hasOVHConfig) {
        // 如果填写了 OVH API，则保存并验证
        await setAPIKeys(formValues);
        const isValid = await checkAuthentication();
        
        if (isValid) {
          toast.success("所有设置已保存并验证通过");
          // 刷新页面加载新配置
          setTimeout(() => {
            window.location.reload();
          }, 500);
        } else {
          toast.warning("OVH API 配置已保存，但验证失败，请检查密钥是否正确");
          setIsSaving(false);
        }
      } else {
        // 如果没填写 OVH API，只保存了安全密钥
        toast.success("网站安全密钥已保存，页面将刷新");
        // 延迟刷新让用户看到提示
        setTimeout(() => {
          window.location.reload();
        }, 800);
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("保存设置失败");
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold mb-1 cyber-glow-text`}>API设置</h1>
        <p className="text-cyber-muted text-sm mb-4 sm:mb-6">配置OVH API和通知设置</p>
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin w-10 h-10 border-4 border-cyber-accent border-t-transparent rounded-full"></div>
          <span className="ml-3 text-cyber-muted">加载中...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="cyber-panel p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* 网站安全密钥 */}
              <div>
                <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold mb-3 sm:mb-4`}>🔐 网站安全密钥</h2>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-4">
                  <p className="text-xs text-yellow-300">
                    ⚠️ 此密钥用于保护前后端通信，需要与后端配置保持一致。请妥善保管，不要泄露！
                  </p>
                </div>
                
                <div>
                  <label className="block text-cyber-muted mb-1 text-xs sm:text-sm">
                    API 安全密钥 <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showValues.apiSecretKey ? "text" : "password"}
                      name="apiSecretKey"
                      value={formValues.apiSecretKey}
                      onChange={handleChange}
                      className="cyber-input w-full pr-10 text-sm"
                      placeholder="输入后端.env文件中的API_SECRET_KEY"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowValue("apiSecretKey")}
                      className="absolute inset-y-0 right-0 px-3 text-cyber-muted hover:text-cyber-accent"
                    >
                      {showValues.apiSecretKey ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      )}
                    </button>
                  </div>
                  <div className="text-xs text-cyan-400 mt-2 space-y-1">
                    <p>💡 请在 <code className="bg-cyan-500/20 px-1 py-0.5 rounded">backend/.env</code> 文件中查找 <code className="bg-cyan-500/20 px-1 py-0.5 rounded">API_SECRET_KEY</code> 的值并复制到此处</p>
                    <p className="text-purple-300">
                      <strong>双重用途：</strong>① API 安全验证  ② 面板解锁密码
                    </p>
                    <p className="text-yellow-300">
                      ⚡ <strong>非首次配置？</strong>只需填写此字段并保存，即可快速解锁进入面板（其他字段无需填写）
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="cyber-grid-line pt-4">
                <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold mb-3 sm:mb-4`}>OVH API 凭据</h2>
                
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-cyber-muted mb-1 text-xs sm:text-sm">
                      应用密钥 (APP KEY)
                    </label>
                    <div className="relative">
                      <input
                        type={showValues.appKey ? "text" : "password"}
                        name="appKey"
                        value={formValues.appKey}
                        onChange={handleChange}
                        className="cyber-input w-full pr-10 text-sm"
                        placeholder="xxxxxxxxxxxxxxxx"
                      />
                      <button
                        type="button"
                        onClick={() => toggleShowValue("appKey")}
                        className="absolute inset-y-0 right-0 px-3 text-cyber-muted hover:text-cyber-accent"
                      >
                        {showValues.appKey ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                            <line x1="1" y1="1" x2="23" y2="23"></line>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-cyber-muted mb-1">
                      应用密钥 (APP SECRET)
                    </label>
                    <div className="relative">
                      <input
                        type={showValues.appSecret ? "text" : "password"}
                        name="appSecret"
                        value={formValues.appSecret}
                        onChange={handleChange}
                        className="cyber-input w-full pr-10"
                        placeholder="xxxxxxxxxxxxxxxx"
                      />
                      <button
                        type="button"
                        onClick={() => toggleShowValue("appSecret")}
                        className="absolute inset-y-0 right-0 px-3 text-cyber-muted hover:text-cyber-accent"
                      >
                        {showValues.appSecret ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                            <line x1="1" y1="1" x2="23" y2="23"></line>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-cyber-muted mb-1">
                      消费者密钥 (CONSUMER KEY)
                    </label>
                    <div className="relative">
                      <input
                        type={showValues.consumerKey ? "text" : "password"}
                        name="consumerKey"
                        value={formValues.consumerKey}
                        onChange={handleChange}
                        className="cyber-input w-full pr-10"
                        placeholder="xxxxxxxxxxxxxxxx"
                      />
                      <button
                        type="button"
                        onClick={() => toggleShowValue("consumerKey")}
                        className="absolute inset-y-0 right-0 px-3 text-cyber-muted hover:text-cyber-accent"
                      >
                        {showValues.consumerKey ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                            <line x1="1" y1="1" x2="23" y2="23"></line>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-cyber-muted mb-1">
                      API 节点 (ENDPOINT)
                    </label>
                    <select
                      name="endpoint"
                      value={formValues.endpoint}
                      onChange={handleChange}
                      className="cyber-input w-full"
                    >
                      <option value="ovh-eu">🇪🇺 欧洲 (ovh-eu) - eu.api.ovh.com</option>
                      <option value="ovh-us">🇺🇸 美国 (ovh-us) - api.us.ovhcloud.com</option>
                      <option value="ovh-ca">🇨🇦 加拿大 (ovh-ca) - ca.api.ovh.com</option>
                    </select>
                    <p className="text-xs text-cyan-400 mt-1">
                      ⚠️ 请选择与您OVH账户所在区域匹配的endpoint
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="cyber-grid-line pt-4">
                <h2 className="text-xl font-bold mb-4">区域设置</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-cyber-muted mb-1">
                      OVH 子公司 (ZONE)
                    </label>
                    <select
                      name="zone"
                      value={formValues.zone}
                      onChange={handleChange}
                      className="cyber-input w-full"
                    >
                      <option value="IE">爱尔兰 (IE)</option>
                      <option value="FR">法国 (FR)</option>
                      <option value="GB">英国 (GB)</option>
                      <option value="DE">德国 (DE)</option>
                      <option value="ES">西班牙 (ES)</option>
                      <option value="PT">葡萄牙 (PT)</option>
                      <option value="IT">意大利 (IT)</option>
                      <option value="PL">波兰 (PL)</option>
                      <option value="FI">芬兰 (FI)</option>
                      <option value="LT">立陶宛 (LT)</option>
                      <option value="CZ">捷克 (CZ)</option>
                      <option value="NL">荷兰 (NL)</option>
                      <option value="CA">加拿大 (CA)</option>
                      <option value="US">美国 (US)</option>
                    </select>
                    <p className="text-xs text-cyber-muted mt-1">默认: IE (欧洲区), CA (加拿大), US (美国)</p>
                  </div>
                  
                  <div>
                    <label className="block text-cyber-muted mb-1">
                      标识 (IAM)
                    </label>
                    <input
                      type="text"
                      name="iam"
                      value={formValues.iam}
                      onChange={handleChange}
                      className="cyber-input w-full"
                      placeholder="go-ovh-ie"
                    />
                    <p className="text-xs text-cyber-muted mt-1">默认会根据 ZONE 设置自动生成，例如: go-ovh-ie</p>
                  </div>
                </div>
              </div>
              
              <div className="cyber-grid-line pt-4">
                <h2 className="text-xl font-bold mb-4">Telegram 通知设置 (可选)</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-cyber-muted mb-1">
                      Telegram Bot Token
                    </label>
                    <div className="relative">
                      <input
                        type={showValues.tgToken ? "text" : "password"}
                        name="tgToken"
                        value={formValues.tgToken}
                        onChange={handleChange}
                        className="cyber-input w-full pr-10"
                        placeholder="123456789:ABCDEFGH..."
                      />
                      <button
                        type="button"
                        onClick={() => toggleShowValue("tgToken")}
                        className="absolute inset-y-0 right-0 px-3 text-cyber-muted hover:text-cyber-accent"
                      >
                        {showValues.tgToken ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                            <line x1="1" y1="1" x2="23" y2="23"></line>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-cyber-muted mb-1">
                      Telegram Chat ID
                    </label>
                    <input
                      type="text"
                      name="tgChatId"
                      value={formValues.tgChatId}
                      onChange={handleChange}
                      className="cyber-input w-full"
                      placeholder="-100123456789"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="cyber-button px-6"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-cyber-text" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      保存中...
                    </span>
                  ) : "保存设置"}
                </button>
              </div>
            </form>
          </div>
          
          <div>
            <div className="cyber-panel p-6">
              <h2 className="text-lg font-bold mb-4">连接状态</h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${isAuthenticated ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                  <span className={isAuthenticated ? 'text-green-400' : 'text-red-400'}>
                    {isAuthenticated ? 'API 已连接' : 'API 未连接'}
                  </span>
                </div>
                
                <div className="cyber-grid-line pt-4">
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 mb-4">
                    <p className="text-xs text-purple-300 font-semibold mb-1.5">🔐 快速解锁提示</p>
                    <p className="text-xs text-purple-200 leading-relaxed">
                      如果您已完成初次配置，本页面还可作为<strong>面板解锁功能</strong>使用。只需输入 <strong>API 安全密钥</strong>（其他字段可不填），点击保存即可进入面板。
                    </p>
                  </div>
                  
                  <h3 className="font-medium mb-2">获取 OVH API 密钥</h3>
                  <p className="text-cyber-muted text-sm mb-3">
                    您需要从 OVH API 控制台获取 APP KEY、APP SECRET 和 CONSUMER KEY 才能使用本服务。
                  </p>
                  
                  <div className="space-y-2">
                    <p className="text-xs text-cyber-muted font-semibold mb-2">选择您的区域：</p>
                    
                    <a 
                      href="https://eu.api.ovh.com/createToken/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="cyber-button text-xs w-full inline-flex items-center justify-center h-9"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5 flex-shrink-0">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                      🇪🇺 欧洲 (ovh-eu) - eu.api.ovh.com
                    </a>
                    
                    <a 
                      href="https://api.us.ovhcloud.com/createToken/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="cyber-button text-xs w-full inline-flex items-center justify-center h-9"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5 flex-shrink-0">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                      🇺🇸 美国 (ovh-us) - api.us.ovhcloud.com
                    </a>
                    
                    <a 
                      href="https://ca.api.ovh.com/createToken/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="cyber-button text-xs w-full inline-flex items-center justify-center h-9"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5 flex-shrink-0">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                      🇨🇦 加拿大 (ovh-ca) - ca.api.ovh.com
                    </a>
                  </div>
                  
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mt-3">
                    <p className="text-xs text-blue-300 font-semibold mb-1">💡 重要提示</p>
                    <ul className="text-xs text-blue-200 space-y-1">
                      <li>• 美国区请选择 <code className="bg-blue-500/20 px-1 py-0.5 rounded">ovh-us</code> 并访问 api.us.ovhcloud.com</li>
                      <li>• Endpoint值请填写 ovh-eu / ovh-us / ovh-ca（不是完整URL）</li>
                      <li>• Zone值对应填写 IE / US / CA</li>
                    </ul>
                  </div>
                </div>
                
                <div className="cyber-grid-line pt-4">
                  <h3 className="font-medium mb-2">所需权限 (Rights)</h3>
                  <p className="text-xs text-cyan-400 mb-3">
                    💡 在 OVH 创建 Token 时，请为每个 HTTP 方法添加 <code className="bg-cyan-500/20 px-1 py-0.5 rounded">/*</code> 完全放开权限：
                  </p>
                  <div className="text-cyber-muted text-sm space-y-2 bg-cyber-dark/50 p-3 rounded border border-cyber-accent/20">
                    <div className="grid grid-cols-[80px_1fr] gap-3 items-center">
                      <div className="font-mono text-cyber-accent font-semibold">GET</div>
                      <div className="font-mono">/*</div>
                    </div>
                    <div className="grid grid-cols-[80px_1fr] gap-3 items-center">
                      <div className="font-mono text-cyber-accent font-semibold">POST</div>
                      <div className="font-mono">/*</div>
                    </div>
                    <div className="grid grid-cols-[80px_1fr] gap-3 items-center">
                      <div className="font-mono text-cyber-accent font-semibold">PUT</div>
                      <div className="font-mono">/*</div>
                    </div>
                    <div className="grid grid-cols-[80px_1fr] gap-3 items-center">
                      <div className="font-mono text-cyber-accent font-semibold">DELETE</div>
                      <div className="font-mono">/*</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 缓存管理器 */}
            <div className="mt-6">
              <CacheManager />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;

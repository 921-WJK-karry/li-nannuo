/**
 * 姓名：李南诺 | 学号：24002120324
 * 时间：2026-11-25 | 大模型：GLM-5.3-Flash
 * 说明：在线客服页交互逻辑，调用后端 POST /api/support/chat（七牛服务商）
 */

// 页面元素
const LNN_chatBox = document.getElementById('LNN_chat_box');
const LNN_chatInput = document.getElementById('LNN_chat_input');
const LNN_sendBtn = document.getElementById('LNN_chat_send');
const LNN_clearBtn = document.getElementById('LNN_chat_clear');
const LNN_modelName = document.getElementById('LNN_model_name');
const LNN_quickChips = document.getElementById('LNN_quick_chips');

// 对话历史（role: user / assistant），客服系统提示词由后端注入
const LNN_messages = [];
let LNN_sending = false;

// 发送消息：把用户消息加入历史并请求后端
async function LNN_sendMessage() {
  const LNN_text = LNN_chatInput.value.trim();
  if (!LNN_text || LNN_sending) return;

  LNN_messages.push({ role: 'user', content: LNN_text });
  LNN_appendBubble('user', LNN_text);
  LNN_chatInput.value = '';

  LNN_sending = true;
  LNN_sendBtn.disabled = true;
  const LNN_loadingRow = LNN_appendLoading();

  try {
    const LNN_resp = await fetch('/api/support/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: LNN_messages })
    });
    const LNN_data = await LNN_resp.json();
    console.log('在线客服接口返回：', LNN_data);

    if (LNN_data.code === 0) {
      LNN_messages.push({ role: 'assistant', content: LNN_data.data.reply });
      if (LNN_data.data.model) LNN_modelName.textContent = LNN_data.data.model;
      LNN_loadingRow.remove();
      LNN_stopThinking();
      LNN_appendBubble('ai', LNN_data.data.reply);
    } else {
      console.error('在线客服回复失败：', LNN_data.msg);
      LNN_loadingRow.remove();
      LNN_stopThinking();
      LNN_appendBubble('error', LNN_data.msg);
    }
  } catch (LNN_err) {
    console.error('在线客服请求异常：', LNN_err);
    LNN_loadingRow.remove();
    LNN_stopThinking();
    LNN_appendBubble('error', '网络请求失败，请确认后端服务已启动');
  } finally {
    LNN_sending = false;
    LNN_sendBtn.disabled = false;
    LNN_chatInput.focus();
  }
}

// 追加一条气泡，返回气泡元素
function LNN_appendBubble(LNN_role, LNN_text) {
  const LNN_row = document.createElement('div');
  LNN_row.className = 'LNN_msg LNN_msg_' + LNN_role;

  const LNN_avatar = document.createElement('div');
  LNN_avatar.className = 'LNN_avatar LNN_avatar_' + LNN_role;
  LNN_avatar.textContent = LNN_role === 'ai' ? '客' : '我';

  const LNN_bubble = document.createElement('div');
  LNN_bubble.className = 'LNN_bubble LNN_bubble_' + LNN_role;
  LNN_bubble.textContent = LNN_text;

  LNN_row.appendChild(LNN_avatar);
  LNN_row.appendChild(LNN_bubble);
  LNN_row.classList.add('LNN_msg_enter');
  LNN_chatBox.appendChild(LNN_row);
  LNN_chatBox.scrollTop = LNN_chatBox.scrollHeight;
  return LNN_bubble;
}

// 停止"客服思考中"的头像脉冲效果
function LNN_stopThinking() {
  document.querySelectorAll('.LNN_avatar_thinking').forEach((LNN_el) => {
    LNN_el.classList.remove('LNN_avatar_thinking');
  });
}

// 追加"加载中"气泡，返回整行消息元素（回复到达后整行移除，避免留下空行）
function LNN_appendLoading() {
  const LNN_bubble = LNN_appendBubble('ai', '');
  LNN_bubble.classList.add('LNN_bubble_loading');
  LNN_bubble.innerHTML =
    '<span class="LNN_loading_dot">●</span><span class="LNN_loading_dot">●</span><span class="LNN_loading_dot">●</span>';
  // 客服思考中：头像叠加脉冲光晕
  LNN_chatBox.lastElementChild.querySelector('.LNN_avatar').classList.add('LNN_avatar_thinking');
  return LNN_bubble.parentElement;
}

// 清空对话
function LNN_clearChat() {
  LNN_messages.length = 0;
  console.log('已清空客服对话历史');
  // 恢复初始欢迎气泡
  LNN_chatBox.innerHTML =
    '<div class="LNN_msg LNN_msg_ai">' +
      '<div class="LNN_avatar LNN_avatar_ai">客</div>' +
      '<div class="LNN_bubble LNN_bubble_ai">您好，我是 LNN-OJ 在线客服，关于报名比赛、提交代码、查看排名等问题都可以问我～</div>' +
    '</div>';
}

// 事件绑定：按钮 + Enter 发送
LNN_sendBtn.addEventListener('click', LNN_sendMessage);
LNN_clearBtn.addEventListener('click', LNN_clearChat);
LNN_chatInput.addEventListener('keydown', (LNN_e) => {
  if (LNN_e.key === 'Enter' && !LNN_e.shiftKey) {
    LNN_e.preventDefault();
    LNN_sendMessage();
  }
});

// 快捷提问标签：点击后填入并发送（发送后隐藏标签栏）
LNN_quickChips.addEventListener('click', (LNN_e) => {
  const LNN_chip = LNN_e.target.closest('.LNN_quick_chip');
  if (!LNN_chip || LNN_sending) return;
  LNN_quickChips.classList.add('LNN_chips_hidden');
  console.log('点击快捷提问：', LNN_chip.textContent);
  LNN_chatInput.value = LNN_chip.textContent;
  LNN_sendMessage();
});

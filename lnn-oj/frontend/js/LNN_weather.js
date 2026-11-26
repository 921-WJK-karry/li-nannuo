/**
 * 姓名：李南诺 | 学号：24002120324
 * 时间：2026-11-25 | 大模型：GLM-5.3-Flash
 * 说明：准点天气 App 页交互——Tab 切换、气象问答（RAG）、知识库上传（XHR 进度条）/列表/删除
 */

const LNN_tabAsk = document.getElementById('LNN_tab_ask');
const LNN_tabKb = document.getElementById('LNN_tab_kb');
const LNN_panelAsk = document.getElementById('LNN_panel_ask');
const LNN_panelKb = document.getElementById('LNN_panel_kb');
const LNN_wxChatBox = document.getElementById('LNN_wx_chat_box');
const LNN_wxQuickChips = document.getElementById('LNN_wx_quick_chips');
const LNN_wxInput = document.getElementById('LNN_wx_input');
const LNN_wxSendBtn = document.getElementById('LNN_wx_send_btn');
const LNN_wxUploadArea = document.getElementById('LNN_wx_upload_area');
const LNN_wxFileInput = document.getElementById('LNN_wx_file_input');
const LNN_wxUploadText = document.getElementById('LNN_wx_upload_text');
const LNN_wxProgressWrap = document.getElementById('LNN_wx_progress_wrap');
const LNN_wxProgressName = document.getElementById('LNN_wx_progress_name');
const LNN_wxProgressPct = document.getElementById('LNN_wx_progress_pct');
const LNN_wxProgressFill = document.getElementById('LNN_wx_progress_fill');
const LNN_wxFileList = document.getElementById('LNN_wx_file_list');

let LNN_wxSending = false;
let LNN_wxUploading = false;

// ===== Tab 切换 =====
function LNN_switchTab(LNN_showAsk) {
  LNN_tabAsk.classList.toggle('LNN_wx_tab_active', LNN_showAsk);
  LNN_tabKb.classList.toggle('LNN_wx_tab_active', !LNN_showAsk);
  LNN_panelAsk.hidden = !LNN_showAsk;
  LNN_panelKb.hidden = LNN_showAsk;
}
LNN_tabAsk.addEventListener('click', () => LNN_switchTab(true));
LNN_tabKb.addEventListener('click', () => LNN_switchTab(false));

// ===== 知识库文件列表 =====
async function LNN_wxLoadFiles() {
  try {
    const LNN_resp = await fetch('/api/weather/files');
    const LNN_data = await LNN_resp.json();
    console.log('天气知识库文件列表：', LNN_data);
    if (LNN_data.code !== 0) {
      console.error('加载天气知识库文件列表失败：', LNN_data.msg);
      return;
    }
    LNN_wxRenderFiles(LNN_data.data.list);
  } catch (LNN_err) {
    console.error('加载天气知识库文件列表异常：', LNN_err);
  }
}

function LNN_wxRenderFiles(LNN_list) {
  if (!LNN_list || LNN_list.length === 0) {
    LNN_wxFileList.innerHTML = '<li class="LNN_wx_kb_empty">知识库暂无文件</li>';
    return;
  }
  const LNN_icons = { doc: '📄', docx: '📄', ppt: '📊', pptx: '📊', pdf: '📕', txt: '📝', md: '📝' };
  LNN_wxFileList.innerHTML = LNN_list.map(LNN_f =>
    '<li class="LNN_wx_file_item" data-id="' + LNN_f.file_id + '">' +
      '<span class="LNN_wx_file_icon">' + (LNN_icons[LNN_f.file_type] || '📁') + '</span>' +
      '<div class="LNN_wx_file_info">' +
        '<p class="LNN_wx_file_name" title="' + LNN_f.original_name + '">' + LNN_f.original_name + '</p>' +
        '<p class="LNN_wx_file_meta">' + LNN_f.file_type.toUpperCase() + ' · ' + (LNN_f.file_size / 1024).toFixed(1) + ' KB · ' + new Date(LNN_f.created_at).toLocaleString('zh-CN') + '</p>' +
        '<span class="LNN_wx_file_status">解析完成 · ' + LNN_f.chunk_count + ' 个文本块</span>' +
      '</div>' +
      '<button type="button" class="LNN_wx_delete_btn" data-id="' + LNN_f.file_id + '">删除</button>' +
    '</li>'
  ).join('');
}

// 删除文件（事件委托，confirm 确认）
LNN_wxFileList.addEventListener('click', async LNN_e => {
  const LNN_btn = LNN_e.target.closest('.LNN_wx_delete_btn');
  if (!LNN_btn) return;
  const LNN_fileId = LNN_btn.dataset.id;
  const LNN_item = LNN_btn.closest('.LNN_wx_file_item');
  const LNN_name = LNN_item.querySelector('.LNN_wx_file_name').textContent;
  if (!window.confirm('确定删除天气知识库文件「' + LNN_name + '」吗？删除后相关问答将无法使用。')) return;
  try {
    const LNN_resp = await fetch('/api/weather/files/' + LNN_fileId, { method: 'DELETE' });
    const LNN_data = await LNN_resp.json();
    console.log('删除天气知识库文件返回：', LNN_data);
    if (LNN_data.code === 0) {
      LNN_wxLoadFiles();
    } else {
      console.error('删除失败：', LNN_data.msg);
      window.alert('删除失败：' + LNN_data.msg);
    }
  } catch (LNN_err) {
    console.error('删除异常：', LNN_err);
    window.alert('删除异常，请查看控制台');
  }
});

// ===== 文件上传（XMLHttpRequest 真实进度条，支持多选逐个上传） =====
LNN_wxUploadArea.addEventListener('click', () => LNN_wxFileInput.click());

LNN_wxFileInput.addEventListener('change', () => {
  if (LNN_wxFileInput.files.length > 0) LNN_wxUploadSequence(Array.from(LNN_wxFileInput.files));
  LNN_wxFileInput.value = '';
});

['dragover', 'dragleave', 'drop'].forEach(LNN_evt => {
  LNN_wxUploadArea.addEventListener(LNN_evt, LNN_e => {
    LNN_e.preventDefault();
    if (LNN_evt === 'dragover') LNN_wxUploadArea.classList.add('LNN_wx_dragover');
    else LNN_wxUploadArea.classList.remove('LNN_wx_dragover');
    if (LNN_evt === 'drop' && LNN_e.dataTransfer.files.length > 0) {
      LNN_wxUploadSequence(Array.from(LNN_e.dataTransfer.files));
    }
  });
});

// 逐个顺序上传多个文件，进度条展示当前文件真实进度
function LNN_wxUploadSequence(LNN_files) {
  if (LNN_wxUploading) {
    window.alert('当前有文件正在上传，请稍候');
    return;
  }
  LNN_wxUploadOne(LNN_files, 0);
}

function LNN_wxUploadOne(LNN_files, LNN_idx) {
  if (LNN_idx >= LNN_files.length) {
    LNN_wxUploading = false;
    LNN_wxProgressWrap.hidden = true;
    LNN_wxUploadText.textContent = '点击或拖拽上传天气知识文件';
    return;
  }
  LNN_wxUploading = true;
  const LNN_file = LNN_files[LNN_idx];
  const LNN_suffix = LNN_files.length > 1 ? '（' + (LNN_idx + 1) + '/' + LNN_files.length + '）' : '';
  LNN_wxUploadText.innerHTML = '<span class="LNN_wx_uploading">正在上传「' + LNN_file.name + '」' + LNN_suffix + '…</span>';
  LNN_wxProgressWrap.hidden = false;
  LNN_wxProgressName.textContent = LNN_file.name;
  LNN_wxProgressPct.textContent = '0%';
  LNN_wxProgressFill.style.width = '0%';

  const LNN_xhr = new XMLHttpRequest();
  LNN_xhr.open('POST', '/api/weather/upload');
  LNN_xhr.upload.onprogress = LNN_e => {
    if (LNN_e.lengthComputable) {
      const LNN_pct = Math.round(LNN_e.loaded / LNN_e.total * 100);
      LNN_wxProgressPct.textContent = LNN_pct + '%';
      LNN_wxProgressFill.style.width = LNN_pct + '%';
    }
  };
  LNN_xhr.onload = () => {
    let LNN_data = null;
    try { LNN_data = JSON.parse(LNN_xhr.responseText); } catch (LNN_err) { /* 非 JSON 响应按异常处理 */ }
    console.log('天气知识库上传返回：', LNN_data);
    if (LNN_xhr.status === 200 && LNN_data && LNN_data.code === 0) {
      LNN_wxProgressPct.textContent = '100%';
      LNN_wxProgressFill.style.width = '100%';
      LNN_wxUploadText.textContent = '✅ ' + LNN_data.data.original_name + ' 解析完成 · ' + LNN_data.data.chunk_count + ' 个文本块';
      setTimeout(() => { LNN_wxUploadOne(LNN_files, LNN_idx + 1); }, 900);
      LNN_wxLoadFiles();
    } else {
      const LNN_msg = LNN_data ? LNN_data.msg : 'HTTP ' + LNN_xhr.status;
      console.error('上传失败：', LNN_msg);
      window.alert('上传失败：' + LNN_msg);
      LNN_wxUploadOne(LNN_files, LNN_idx + 1);
    }
  };
  LNN_xhr.onerror = () => {
    console.error('上传网络异常：', LNN_file.name);
    window.alert('上传网络异常，请查看控制台');
    LNN_wxUploadOne(LNN_files, LNN_idx + 1);
  };
  const LNN_form = new FormData();
  LNN_form.append('file', LNN_file);
  LNN_xhr.send(LNN_form);
}

// ===== 气象问答 =====
function LNN_wxAppendBubble(LNN_role, LNN_html) {
  const LNN_row = document.createElement('div');
  LNN_row.className = 'LNN_wx_msg ' + (LNN_role === 'user' ? 'LNN_wx_msg_user' : LNN_role === 'error' ? 'LNN_wx_msg_error' : 'LNN_wx_msg_ai');
  const LNN_bubbleCls = LNN_role === 'error' ? 'LNN_wx_bubble LNN_wx_bubble_error' : LNN_role === 'user' ? 'LNN_wx_bubble LNN_wx_bubble_user' : 'LNN_wx_bubble LNN_wx_bubble_ai';
  LNN_row.innerHTML =
    '<div class="LNN_wx_avatar">' + (LNN_role === 'user' ? '我' : '点') + '</div>' +
    '<div class="' + LNN_bubbleCls + '">' + LNN_html + '</div>';
  LNN_wxChatBox.appendChild(LNN_row);
  LNN_wxChatBox.scrollTop = LNN_wxChatBox.scrollHeight;
  return LNN_row;
}

function LNN_wxAppendLoading() {
  const LNN_row = document.createElement('div');
  LNN_row.className = 'LNN_wx_msg LNN_wx_msg_ai';
  LNN_row.innerHTML =
    '<div class="LNN_wx_avatar LNN_wx_thinking">点</div>' +
    '<div class="LNN_wx_bubble LNN_wx_bubble_ai"><span class="LNN_wx_dots"><i></i><i></i><i></i></span> 点点正在翻看气象知识…</div>';
  LNN_wxChatBox.appendChild(LNN_row);
  LNN_wxChatBox.scrollTop = LNN_wxChatBox.scrollHeight;
  return LNN_row;
}

function LNN_wxEscape(LNN_text) {
  return LNN_text.replace(/</g, '&lt;');
}

async function LNN_wxSendQuestion(LNN_text) {
  if (LNN_wxSending || !LNN_text) return;
  LNN_wxSending = true;
  LNN_wxSendBtn.disabled = true;
  LNN_wxAppendBubble('user', LNN_wxEscape(LNN_text));
  const LNN_loadingRow = LNN_wxAppendLoading();

  try {
    const LNN_reqBody = { question: LNN_text };
    console.log('气象问答发送：', LNN_reqBody);
    const LNN_resp = await fetch('/api/weather/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(LNN_reqBody)
    });
    const LNN_data = await LNN_resp.json();
    console.log('气象问答返回：', LNN_data);

    LNN_loadingRow.remove();
    if (LNN_data.code === 0) {
      // AI 气泡：回答正文 + 底部来源标注（📎 来源文件 + 实际使用的模型名）
      let LNN_html = '<span class="LNN_wx_answer">' + LNN_wxEscape(LNN_data.data.answer) + '</span>';
      const LNN_sourceParts = [];
      if (LNN_data.data.sources && LNN_data.data.sources.length > 0) {
        LNN_sourceParts.push('📎 来源：' + LNN_data.data.sources.join('、'));
      }
      if (LNN_data.data.model) {
        LNN_sourceParts.push('🤖 模型：' + LNN_data.data.model);
      }
      if (LNN_sourceParts.length > 0) {
        LNN_html += '<span class="LNN_wx_source">' + LNN_wxEscape(LNN_sourceParts.join(' | ')) + '</span>';
      }
      LNN_wxAppendBubble('ai', LNN_html);
    } else {
      console.error('气象问答失败：', LNN_data.msg);
      LNN_wxAppendBubble('error', LNN_wxEscape(LNN_data.msg));
    }
  } catch (LNN_err) {
    console.error('气象问答异常：', LNN_err);
    LNN_loadingRow.remove();
    LNN_wxAppendBubble('error', '网络异常：' + LNN_wxEscape(LNN_err.message));
  } finally {
    LNN_wxSending = false;
    LNN_wxSendBtn.disabled = false;
    LNN_wxInput.focus();
  }
}

// 输入交互：Enter 发送，Shift+Enter 换行
LNN_wxInput.addEventListener('keydown', LNN_e => {
  if (LNN_e.key === 'Enter' && !LNN_e.shiftKey) {
    LNN_e.preventDefault();
    const LNN_text = LNN_wxInput.value.trim();
    if (LNN_text) { LNN_wxInput.value = ''; LNN_wxAutoGrow(); LNN_wxSendQuestion(LNN_text); }
  }
});

LNN_wxSendBtn.addEventListener('click', () => {
  const LNN_text = LNN_wxInput.value.trim();
  if (LNN_text) { LNN_wxInput.value = ''; LNN_wxAutoGrow(); LNN_wxSendQuestion(LNN_text); }
});

// 快捷提问（点击即发送）
LNN_wxQuickChips.addEventListener('click', LNN_e => {
  if (LNN_e.target.classList.contains('LNN_wx_chip')) {
    LNN_wxQuickChips.style.display = 'none';
    LNN_wxSendQuestion(LNN_e.target.textContent);
  }
});

// 输入框自适应高度
function LNN_wxAutoGrow() {
  LNN_wxInput.style.height = 'auto';
  LNN_wxInput.style.height = Math.min(LNN_wxInput.scrollHeight, 96) + 'px';
}
LNN_wxInput.addEventListener('input', LNN_wxAutoGrow);

// 初始化
LNN_wxLoadFiles();

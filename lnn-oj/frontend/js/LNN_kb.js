/**
 * 姓名：李南诺 | 学号：24002120324
 * 时间：2026-11-25 | 大模型：GLM-5.3-Flash
 * 说明：知识库问答页交互——文件上传、文件列表管理、基于知识库的 RAG 问答
 */

const LNN_fileInput = document.getElementById('LNN_file_input');
const LNN_pickBtn = document.getElementById('LNN_pick_btn');
const LNN_uploadArea = document.getElementById('LNN_upload_area');
const LNN_fileList = document.getElementById('LNN_file_list');
const LNN_chatBox = document.getElementById('LNN_chat_box');
const LNN_quickChips = document.getElementById('LNN_quick_chips');
const LNN_input = document.getElementById('LNN_input');
const LNN_sendBtn = document.getElementById('LNN_send_btn');
const LNN_clearBtn = document.getElementById('LNN_clear_btn');

let LNN_sending = false;

// 对话历史（仅本次会话内存中）
const LNN_messages = [];

// ===== 文件列表加载 =====
async function LNN_loadFiles() {
  try {
    const LNN_resp = await fetch('/api/kb/files');
    const LNN_data = await LNN_resp.json();
    console.log('知识库文件列表：', LNN_data);
    if (LNN_data.code !== 0) {
      console.error('加载文件列表失败：', LNN_data.msg);
      return;
    }
    LNN_renderFiles(LNN_data.data.list);
  } catch (LNN_err) {
    console.error('加载文件列表异常：', LNN_err);
  }
}

function LNN_renderFiles(LNN_list) {
  if (!LNN_list || LNN_list.length === 0) {
    LNN_fileList.innerHTML = '<li class="LNN_kb_empty">知识库暂无文件</li>';
    return;
  }
  const LNN_icons = { doc: '📄', docx: '📄', ppt: '📊', pptx: '📊', pdf: '📕', txt: '📝', md: '📝' };
  LNN_fileList.innerHTML = LNN_list.map(LNN_f =>
    '<li class="LNN_kb_file_item" data-id="' + LNN_f.file_id + '">' +
      '<span class="LNN_kb_file_icon">' + (LNN_icons[LNN_f.file_type] || '📁') + '</span>' +
      '<div class="LNN_kb_file_info">' +
        '<p class="LNN_kb_file_name" title="' + LNN_f.original_name + '">' + LNN_f.original_name + '</p>' +
        '<p class="LNN_kb_file_meta">' + LNN_f.file_type.toUpperCase() + ' · ' + (LNN_f.file_size / 1024).toFixed(1) + ' KB · ' + LNN_f.chunk_count + ' 个文本块 · ' + new Date(LNN_f.created_at).toLocaleString('zh-CN') + '</p>' +
      '</div>' +
      '<button type="button" class="LNN_kb_delete_btn" data-id="' + LNN_f.file_id + '">删除</button>' +
    '</li>'
  ).join('');
}

// 删除文件（事件委托）
LNN_fileList.addEventListener('click', async LNN_e => {
  const LNN_btn = LNN_e.target.closest('.LNN_kb_delete_btn');
  if (!LNN_btn) return;
  const LNN_fileId = LNN_btn.dataset.id;
  const LNN_item = LNN_btn.closest('.LNN_kb_file_item');
  const LNN_name = LNN_item.querySelector('.LNN_kb_file_name').textContent;
  if (!window.confirm('确定删除知识库文件「' + LNN_name + '」吗？')) return;
  try {
    const LNN_resp = await fetch('/api/kb/files/' + LNN_fileId, { method: 'DELETE' });
    const LNN_data = await LNN_resp.json();
    console.log('删除文件返回：', LNN_data);
    if (LNN_data.code === 0) {
      LNN_loadFiles();
    } else {
      window.alert('删除失败：' + LNN_data.msg);
    }
  } catch (LNN_err) {
    console.error('删除异常：', LNN_err);
    window.alert('删除异常，请查看控制台');
  }
});

// ===== 文件上传 =====
LNN_pickBtn.addEventListener('click', () => LNN_fileInput.click());

LNN_fileInput.addEventListener('change', () => {
  if (LNN_fileInput.files.length > 0) LNN_doUpload(LNN_fileInput.files[0]);
});

// 拖拽上传
['dragover', 'dragleave', 'drop'].forEach(LNN_evt => {
  LNN_uploadArea.addEventListener(LNN_evt, LNN_e => {
    LNN_e.preventDefault();
    if (LNN_evt === 'dragover') LNN_uploadArea.classList.add('LNN_dragover');
    else LNN_uploadArea.classList.remove('LNN_dragover');
    if (LNN_evt === 'drop' && LNN_e.dataTransfer.files.length > 0) LNN_doUpload(LNN_e.dataTransfer.files[0]);
  });
});

async function LNN_doUpload(LNN_file) {
  const LNN_hint = LNN_uploadArea.querySelector('.LNN_upload_text');
  const LNN_oldText = LNN_hint.textContent;
  LNN_hint.innerHTML = '<span class="LNN_uploading">正在上传并解析「' + LNN_file.name + '」…</span>';
  try {
    const LNN_form = new FormData();
    LNN_form.append('file', LNN_file);
    const LNN_resp = await fetch('/api/kb/upload', { method: 'POST', body: LNN_form });
    const LNN_data = await LNN_resp.json();
    console.log('上传返回：', LNN_data);
    if (LNN_data.code === 0) {
      LNN_hint.textContent = '✅ ' + LNN_data.data.original_name + ' 入库成功（' + LNN_data.data.chunk_count + ' 个文本块）';
      setTimeout(() => { LNN_hint.textContent = '点击选择或拖拽文件到此处上传'; }, 3500);
      LNN_loadFiles();
    } else {
      console.error('上传失败：', LNN_data.msg);
      LNN_hint.textContent = LNN_oldText;
      window.alert('上传失败：' + LNN_data.msg);
    }
  } catch (LNN_err) {
    console.error('上传异常：', LNN_err);
    LNN_hint.textContent = LNN_oldText;
    window.alert('上传异常，请查看控制台');
  }
  LNN_fileInput.value = '';
}

// ===== RAG 问答 =====
function LNN_appendBubble(LNN_role, LNN_text) {
  const LNN_row = document.createElement('div');
  LNN_row.className = 'LNN_msg ' + (LNN_role === 'user' ? 'LNN_msg_user' : LNN_role === 'error' ? 'LNN_msg_error' : 'LNN_msg_ai');
  const LNN_avatar = LNN_role === 'user' ? '我' : '📚';
  const LNN_avatarCls = LNN_role === 'user' ? 'LNN_avatar LNN_avatar_user' : 'LNN_avatar LNN_avatar_ai';
  const LNN_bubbleCls = LNN_role === 'error' ? 'LNN_bubble LNN_bubble_error' : LNN_role === 'user' ? 'LNN_bubble LNN_bubble_user' : 'LNN_bubble LNN_bubble_ai';
  LNN_row.innerHTML =
    '<div class="' + LNN_avatarCls + '">' + LNN_avatar + '</div>' +
    '<div class="' + LNN_bubbleCls + '">' + LNN_text.replace(/</g, '&lt;').replace(/\n/g, '<br>') + '</div>';
  LNN_chatBox.appendChild(LNN_row);
  LNN_chatBox.scrollTop = LNN_chatBox.scrollHeight;
  return LNN_row;
}

function LNN_appendLoading() {
  const LNN_row = document.createElement('div');
  LNN_row.className = 'LNN_msg LNN_msg_ai';
  LNN_row.innerHTML =
    '<div class="LNN_avatar LNN_avatar_ai LNN_thinking">📚</div>' +
    '<div class="LNN_bubble LNN_bubble_ai"><span class="LNN_loading_dots"><i></i><i></i><i></i></span></div>';
  LNN_chatBox.appendChild(LNN_row);
  LNN_chatBox.scrollTop = LNN_chatBox.scrollHeight;
  return LNN_row;
}

function LNN_stopThinking() {
  const LNN_thinking = LNN_chatBox.querySelector('.LNN_thinking');
  if (LNN_thinking) LNN_thinking.classList.remove('LNN_thinking');
}

async function LNN_sendQuestion(LNN_text) {
  if (LNN_sending || !LNN_text) return;
  LNN_sending = true;
  LNN_sendBtn.disabled = true;
  LNN_appendBubble('user', LNN_text);
  LNN_messages.push({ role: 'user', content: LNN_text });
  const LNN_loadingRow = LNN_appendLoading();

  try {
    const LNN_resp = await fetch('/api/kb/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: LNN_text })
    });
    const LNN_data = await LNN_resp.json();
    console.log('知识库问答返回：', LNN_data);

    LNN_loadingRow.remove();
    if (LNN_data.code === 0) {
      let LNN_replyText = LNN_data.data.reply;
      // 附上来源文件，便于确认答案出自哪个上传文档
      if (LNN_data.data.sources && LNN_data.data.sources.length > 0) {
        LNN_replyText += '\n📎 来源：' + LNN_data.data.sources.join('、');
      }
      LNN_appendBubble('ai', LNN_replyText);
    } else {
      console.error('知识库问答失败：', LNN_data.msg);
      LNN_appendBubble('error', LNN_data.msg);
    }
  } catch (LNN_err) {
    console.error('知识库问答异常：', LNN_err);
    LNN_loadingRow.remove();
    LNN_appendBubble('error', '网络异常：' + LNN_err.message);
  } finally {
    LNN_sending = false;
    LNN_sendBtn.disabled = false;
    LNN_input.focus();
  }
}

// 输入交互
LNN_input.addEventListener('keydown', LNN_e => {
  if (LNN_e.key === 'Enter' && !LNN_e.shiftKey) {
    LNN_e.preventDefault();
    const LNN_text = LNN_input.value.trim();
    if (LNN_text) { LNN_input.value = ''; LNN_autoGrow(); LNN_sendQuestion(LNN_text); }
  }
});

LNN_sendBtn.addEventListener('click', () => {
  const LNN_text = LNN_input.value.trim();
  if (LNN_text) { LNN_input.value = ''; LNN_autoGrow(); LNN_sendQuestion(LNN_text); }
});

// 快捷提问（点击即发送）
LNN_quickChips.addEventListener('click', LNN_e => {
  if (LNN_e.target.classList.contains('LNN_quick_chip')) {
    LNN_quickChips.style.display = 'none';
    LNN_sendQuestion(LNN_e.target.textContent);
  }
});

// 自适应高度
function LNN_autoGrow() {
  LNN_input.style.height = 'auto';
  LNN_input.style.height = Math.min(LNN_input.scrollHeight, 120) + 'px';
}
LNN_input.addEventListener('input', LNN_autoGrow);

// 清空对话
LNN_clearBtn.addEventListener('click', () => {
  LNN_messages.length = 0;
  LNN_quickChips.style.display = '';
  console.log('已清空对话历史');
  LNN_chatBox.innerHTML =
    '<div class="LNN_msg LNN_msg_ai">' +
      '<div class="LNN_avatar LNN_avatar_ai">📚</div>' +
      '<div class="LNN_bubble LNN_bubble_ai">您好！请先上传知识库文件，然后就可以向我提问知识库里的内容啦～</div>' +
    '</div>';
});

// 初始化
LNN_loadFiles();

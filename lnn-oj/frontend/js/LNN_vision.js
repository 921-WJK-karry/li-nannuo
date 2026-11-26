/**
 * 姓名：李南诺 | 学号：24002120324
 * 时间：2026-11-25 | 大模型：GLM-5.3-Flash
 * 说明：图像识别页交互——图片上传预览、调用 /api/ai/vision 展示识别结果
 */

const LNN_imageInput = document.getElementById('LNN_image_input');
const LNN_pickBtn = document.getElementById('LNN_pick_btn');
const LNN_uploadArea = document.getElementById('LNN_upload_area');
const LNN_uploadText = document.getElementById('LNN_upload_text');
const LNN_previewWrap = document.getElementById('LNN_preview_wrap');
const LNN_previewImg = document.getElementById('LNN_preview_img');
const LNN_previewMeta = document.getElementById('LNN_preview_meta');
const LNN_input = document.getElementById('LNN_input');
const LNN_resultBox = document.getElementById('LNN_result_box');
const LNN_modelName = document.getElementById('LNN_model_name');

// 选择图片
LNN_pickBtn.addEventListener('click', () => LNN_imageInput.click());

LNN_imageInput.addEventListener('change', () => {
  if (LNN_imageInput.files.length > 0) LNN_doRecognize(LNN_imageInput.files[0]);
});

// 拖拽上传
['dragover', 'dragleave', 'drop'].forEach(LNN_evt => {
  LNN_uploadArea.addEventListener(LNN_evt, LNN_e => {
    LNN_e.preventDefault();
    if (LNN_evt === 'dragover') LNN_uploadArea.classList.add('LNN_dragover');
    else LNN_uploadArea.classList.remove('LNN_dragover');
    if (LNN_evt === 'drop' && LNN_e.dataTransfer.files.length > 0) LNN_doRecognize(LNN_e.dataTransfer.files[0]);
  });
});

// 输入框回车也触发识别（使用当前预览的图片）
LNN_input.addEventListener('keydown', LNN_e => {
  if (LNN_e.key === 'Enter' && !LNN_e.shiftKey) {
    LNN_e.preventDefault();
    if (LNN_lastFile) LNN_doRecognize(LNN_lastFile);
  }
});

let LNN_lastFile = null;

async function LNN_doRecognize(LNN_file) {
  LNN_lastFile = LNN_file;

  // 本地预览
  const LNN_url = URL.createObjectURL(LNN_file);
  LNN_previewImg.src = LNN_url;
  LNN_previewMeta.textContent = LNN_file.name + ' · ' + (LNN_file.size / 1024).toFixed(1) + ' KB';
  LNN_previewWrap.style.display = '';

  // 结果区显示加载中
  LNN_resultBox.classList.remove('LNN_error');
  LNN_resultBox.innerHTML = '<p class="LNN_vision_loading">🔍 正在识别图片「' + LNN_file.name + '」，请稍候…</p>';
  LNN_uploadText.innerHTML = '<span class="LNN_uploading">正在识别「' + LNN_file.name + '」…</span>';

  try {
    const LNN_form = new FormData();
    LNN_form.append('image', LNN_file);
    const LNN_question = LNN_input.value.trim();
    if (LNN_question) LNN_form.append('question', LNN_question);

    const LNN_resp = await fetch('/api/ai/vision', { method: 'POST', body: LNN_form });
    const LNN_data = await LNN_resp.json();
    console.log('图像识别接口返回：', LNN_data);

    if (LNN_data.code === 0) {
      LNN_resultBox.innerHTML = LNN_data.data.description.replace(/</g, '&lt;').replace(/\n/g, '<br>');
      if (LNN_data.data.usage) {
        const LNN_u = document.createElement('p');
        LNN_u.className = 'LNN_vision_usage';
        LNN_u.textContent = 'Token 用量：输入 ' + LNN_data.data.usage.prompt_tokens + ' / 输出 ' + LNN_data.data.usage.completion_tokens;
        LNN_resultBox.appendChild(LNN_u);
      }
      if (LNN_data.data.model) LNN_modelName.textContent = LNN_data.data.model;
      LNN_uploadText.textContent = '✅ ' + LNN_file.name + ' 识别完成';
      setTimeout(() => { LNN_uploadText.textContent = '点击选择或拖拽图片到此处上传'; }, 3500);
    } else {
      console.error('图像识别失败：', LNN_data.msg);
      LNN_resultBox.classList.add('LNN_error');
      LNN_resultBox.textContent = '❌ ' + LNN_data.msg;
      LNN_uploadText.textContent = '点击选择或拖拽图片到此处上传';
    }
  } catch (LNN_err) {
    console.error('图像识别异常：', LNN_err);
    LNN_resultBox.classList.add('LNN_error');
    LNN_resultBox.textContent = '❌ 网络异常：' + LNN_err.message;
    LNN_uploadText.textContent = '点击选择或拖拽图片到此处上传';
  }
  LNN_imageInput.value = '';
}

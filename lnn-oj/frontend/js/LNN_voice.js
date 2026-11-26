/**
 * 姓名：李南诺 | 学号：24002120324
 * 时间：2026-11-25 | 大模型：GLM-5.3-Flash
 * 说明：语音识别页交互——MediaRecorder 麦克风录音 / 音频文件上传，调用 /api/asr/recognize 展示转写结果
 */

const LNN_micBtn = document.getElementById('LNN_mic_btn');
const LNN_recordStatus = document.getElementById('LNN_record_status');
const LNN_recordTime = document.getElementById('LNN_record_time');
const LNN_playback = document.getElementById('LNN_playback');
const LNN_audioInput = document.getElementById('LNN_audio_input');
const LNN_pickBtn = document.getElementById('LNN_pick_btn');
const LNN_uploadArea = document.getElementById('LNN_upload_area');
const LNN_uploadText = document.getElementById('LNN_upload_text');
const LNN_resultBox = document.getElementById('LNN_result_box');
const LNN_modelName = document.getElementById('LNN_model_name');

/* ============ 通用：识别请求与结果展示 ============ */
let LNN_recognizing = false;

function LNN_showLoading(LNN_tip) {
  LNN_resultBox.classList.remove('LNN_error');
  LNN_resultBox.innerHTML = '<p class="LNN_voice_loading">🔍 ' + LNN_tip + '，正在识别…</p>';
}

function LNN_showResult(LNN_data) {
  LNN_resultBox.innerHTML = (LNN_data.text || '（识别结果为空）')
    .replace(/</g, '&lt;').replace(/\n/g, '<br>');
  const LNN_meta = document.createElement('p');
  LNN_meta.className = 'LNN_voice_meta';
  const LNN_parts = ['服务商：' + LNN_data.providerLabel, '模型：' + LNN_data.model];
  if (LNN_data.language) LNN_parts.push('语言：' + LNN_data.language);
  if (LNN_data.audio) LNN_parts.push('音频：' + LNN_data.audio.name + '（' + (LNN_data.audio.size / 1024).toFixed(1) + ' KB）');
  LNN_meta.textContent = LNN_parts.join(' · ');
  LNN_resultBox.appendChild(LNN_meta);
  LNN_modelName.textContent = LNN_data.providerLabel + ' · ' + LNN_data.model;
}

function LNN_showError(LNN_msg) {
  LNN_resultBox.classList.add('LNN_error');
  LNN_resultBox.textContent = '❌ ' + LNN_msg;
}

async function LNN_recognizeBlob(LNN_blob, LNN_filename, LNN_mime, LNN_tip) {
  if (LNN_recognizing) return;
  LNN_recognizing = true;
  LNN_showLoading(LNN_tip);
  try {
    const LNN_form = new FormData();
    LNN_form.append('audio', new Blob([LNN_blob], { type: LNN_mime }), LNN_filename);
    const LNN_resp = await fetch('/api/asr/recognize', { method: 'POST', body: LNN_form });
    const LNN_data = await LNN_resp.json();
    console.log('语音识别接口返回：', LNN_data);
    if (LNN_data.code === 0) {
      LNN_showResult(LNN_data.data);
      LNN_uploadText.textContent = '✅ 识别完成';
      setTimeout(() => { LNN_uploadText.textContent = '点击选择音频文件'; }, 3000);
    } else {
      console.error('语音识别失败：', LNN_data.msg);
      LNN_showError(LNN_data.msg);
    }
  } catch (LNN_err) {
    console.error('语音识别异常：', LNN_err);
    LNN_showError('网络异常：' + LNN_err.message);
  }
  LNN_recognizing = false;
}

/* ============ 麦克风录音 ============ */
let LNN_mediaRecorder = null;
let LNN_chunks = [];
let LNN_timer = null;
let LNN_seconds = 0;
let LNN_stream = null;

LNN_micBtn.addEventListener('click', async () => {
  if (LNN_mediaRecorder && LNN_mediaRecorder.state === 'recording') {
    LNN_mediaRecorder.stop();
    return;
  }
  // 开始录音
  try {
    LNN_stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch (LNN_err) {
    console.error('获取麦克风失败：', LNN_err);
    LNN_recordStatus.textContent = '❌ 无法访问麦克风：' + (LNN_err.message || '权限被拒绝');
    return;
  }
  LNN_chunks = [];
  const LNN_mime = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : '';
  LNN_mediaRecorder = new MediaRecorder(LNN_stream, LNN_mime ? { mimeType: LNN_mime } : undefined);
  LNN_mediaRecorder.ondataavailable = LNN_e => { if (LNN_e.data.size > 0) LNN_chunks.push(LNN_e.data); };
  LNN_mediaRecorder.onstop = () => {
    clearInterval(LNN_timer);
    if (LNN_stream) { LNN_stream.getTracks().forEach(LNN_t => LNN_t.stop()); LNN_stream = null; }
    LNN_micBtn.classList.remove('LNN_recording');
    LNN_recordStatus.textContent = '录音结束，自动识别中';
    LNN_recordTime.textContent = '';
    const LNN_blob = new Blob(LNN_chunks, { type: LNN_mediaRecorder.mimeType || 'audio/webm' });
    const LNN_ext = (LNN_mediaRecorder.mimeType || 'audio/webm').indexOf('mp4') !== -1 ? 'm4a' : 'webm';
    // 本地回放
    LNN_playback.src = URL.createObjectURL(LNN_blob);
    LNN_playback.style.display = '';
    LNN_recognizeBlob(LNN_blob, 'recording.' + LNN_ext, LNN_blob.type, '录音（' + LNN_seconds + ' 秒）');
  };
  LNN_mediaRecorder.start();
  LNN_micBtn.classList.add('LNN_recording');
  LNN_playback.style.display = 'none';
  LNN_seconds = 0;
  LNN_recordStatus.textContent = '🔴 录音中…再次点击结束';
  LNN_recordTime.textContent = '0:00';
  LNN_timer = setInterval(() => {
    LNN_seconds++;
    LNN_recordTime.textContent = Math.floor(LNN_seconds / 60) + ':' + String(LNN_seconds % 60).padStart(2, '0');
    if (LNN_seconds >= 60) LNN_mediaRecorder.stop(); // 最长 60 秒自动停止
  }, 1000);
});

/* ============ 文件上传 ============ */
LNN_pickBtn.addEventListener('click', () => LNN_audioInput.click());

LNN_audioInput.addEventListener('change', () => {
  if (LNN_audioInput.files.length > 0) LNN_doUpload(LNN_audioInput.files[0]);
});

['dragover', 'dragleave', 'drop'].forEach(LNN_evt => {
  LNN_uploadArea.addEventListener(LNN_evt, LNN_e => {
    LNN_e.preventDefault();
    if (LNN_evt === 'dragover') LNN_uploadArea.classList.add('LNN_dragover');
    else LNN_uploadArea.classList.remove('LNN_dragover');
    if (LNN_evt === 'drop' && LNN_e.dataTransfer.files.length > 0) LNN_doUpload(LNN_e.dataTransfer.files[0]);
  });
});

function LNN_doUpload(LNN_file) {
  LNN_recognizeBlob(LNN_file, LNN_file.name, LNN_file.type || 'audio/mpeg', '音频「' + LNN_file.name + '」');
  LNN_audioInput.value = '';
}

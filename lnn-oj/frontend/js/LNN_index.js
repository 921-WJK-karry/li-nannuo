/**
 * 姓名：李南诺 | 学号：24002120324
 * 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 说明：项目首页脚本（原生 JS，变量/函数名均以 LNN_ 开头）
 *       1. canvas 粒子连线背景动画
 *       2. 检测后端服务状态（结果输出到浏览器控制台）
 */

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  LNN_startCanvasAnimation();
  LNN_checkServerStatus();
});

/* ==================== canvas 背景动画 ==================== */

// 初始化 canvas 粒子动画
function LNN_startCanvasAnimation() {
  const LNN_canvas = document.getElementById('LNN_bg_canvas');
  const LNN_ctx = LNN_canvas.getContext('2d');

  // 粒子数量与连线距离阈值
  const LNN_particle_count = 60;
  const LNN_link_distance = 130;

  let LNN_particles = [];

  // 根据窗口大小调整 canvas 尺寸
  function LNN_resize() {
    LNN_canvas.width = window.innerWidth;
    LNN_canvas.height = window.innerHeight;
  }

  // 创建粒子（随机位置、速度、半径）
  function LNN_createParticles() {
    LNN_particles = [];
    for (let LNN_i = 0; LNN_i < LNN_particle_count; LNN_i++) {
      LNN_particles.push({
        LNN_x: Math.random() * LNN_canvas.width,
        LNN_y: Math.random() * LNN_canvas.height,
        LNN_vx: (Math.random() - 0.5) * 0.45,
        LNN_vy: (Math.random() - 0.5) * 0.45,
        LNN_r: Math.random() * 1.8 + 0.8
      });
    }
  }

  // 粒子移动，越界后从另一侧穿出
  function LNN_moveParticles() {
    LNN_particles.forEach(LNN_p => {
      LNN_p.LNN_x += LNN_p.LNN_vx;
      LNN_p.LNN_y += LNN_p.LNN_vy;
      if (LNN_p.LNN_x < 0) LNN_p.LNN_x = LNN_canvas.width;
      if (LNN_p.LNN_x > LNN_canvas.width) LNN_p.LNN_x = 0;
      if (LNN_p.LNN_y < 0) LNN_p.LNN_y = LNN_canvas.height;
      if (LNN_p.LNN_y > LNN_canvas.height) LNN_p.LNN_y = 0;
    });
  }

  // 绘制粒子与粒子间连线
  function LNN_draw() {
    LNN_ctx.clearRect(0, 0, LNN_canvas.width, LNN_canvas.height);

    // 连线
    for (let LNN_i = 0; LNN_i < LNN_particles.length; LNN_i++) {
      for (let LNN_j = LNN_i + 1; LNN_j < LNN_particles.length; LNN_j++) {
        const LNN_dx = LNN_particles[LNN_i].LNN_x - LNN_particles[LNN_j].LNN_x;
        const LNN_dy = LNN_particles[LNN_i].LNN_y - LNN_particles[LNN_j].LNN_y;
        const LNN_dist = Math.sqrt(LNN_dx * LNN_dx + LNN_dy * LNN_dy);
        if (LNN_dist < LNN_link_distance) {
          LNN_ctx.strokeStyle =
            'rgba(34, 184, 162,' + (0.30 * (1 - LNN_dist / LNN_link_distance)).toFixed(3) + ')';
          LNN_ctx.lineWidth = 1;
          LNN_ctx.beginPath();
          LNN_ctx.moveTo(LNN_particles[LNN_i].LNN_x, LNN_particles[LNN_i].LNN_y);
          LNN_ctx.lineTo(LNN_particles[LNN_j].LNN_x, LNN_particles[LNN_j].LNN_y);
          LNN_ctx.stroke();
        }
      }
    }

    // 粒子
    LNN_particles.forEach(LNN_p => {
      // 薄荷/樱花双色粒子
      LNN_ctx.fillStyle = LNN_p.LNN_r > 2.2 ? 'rgba(255, 143, 171, 0.55)' : 'rgba(34, 184, 162, 0.55)';
      LNN_ctx.beginPath();
      LNN_ctx.arc(LNN_p.LNN_x, LNN_p.LNN_y, LNN_p.LNN_r, 0, Math.PI * 2);
      LNN_ctx.fill();
    });
  }

  // 动画主循环
  function LNN_loop() {
    LNN_moveParticles();
    LNN_draw();
    requestAnimationFrame(LNN_loop);
  }

  // 窗口变化时重建
  window.addEventListener('resize', () => {
    LNN_resize();
    LNN_createParticles();
  });

  LNN_resize();
  LNN_createParticles();
  LNN_loop();
}

/* ==================== 服务状态检测 ==================== */

// 请求后端健康检查接口，更新首页服务状态徽标
async function LNN_checkServerStatus() {
  const LNN_statusEl = document.getElementById('LNN_server_status');
  try {
    const LNN_res = await fetch('/api/health');
    const LNN_data = await LNN_res.json();
    // 服务器返回的数据输出到控制台
    console.log('[LNN_index] /api/health 响应：', LNN_data);

    if (LNN_data && LNN_data.code === 0) {
      LNN_statusEl.textContent = '后端服务在线（端口 8324）';
      LNN_statusEl.classList.add('LNN_status_online');
    } else {
      LNN_statusEl.textContent = '服务响应异常';
      LNN_statusEl.classList.add('LNN_status_offline');
    }
  } catch (LNN_err) {
    // 错误信息输出到控制台
    console.error('[LNN_index] 服务状态检测失败：', LNN_err);
    LNN_statusEl.textContent = '后端服务离线';
    LNN_statusEl.classList.add('LNN_status_offline');
  }
}

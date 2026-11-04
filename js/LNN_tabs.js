// LNN_tabs.js —— 可复用的 Tab 选项卡组件（外部引用）
// 用法：LNN_initTabs({ LNN_tabs: '选项卡选择器', LNN_panels: '面板选择器', LNN_active: '选中类名', LNN_show: '面板显示类名' })
// 约定：选项卡与面板按文档顺序一一对应

// 初始化一组选项卡：为每个选项卡绑定点击监听事件，
// 切换逻辑为先清除所有选项卡的选中状态，再设置当前元素的选中状态
function LNN_initTabs(LNN_opts) {
  var LNN_tabs = document.querySelectorAll(LNN_opts.LNN_tabs);
  var LNN_panels = document.querySelectorAll(LNN_opts.LNN_panels);
  var LNN_active = LNN_opts.LNN_active;
  var LNN_show = LNN_opts.LNN_show;

  for (var LNN_i = 0; LNN_i < LNN_tabs.length; LNN_i++) {
    LNN_tabs[LNN_i].addEventListener('click', function () {
      // 第一步：先清除所有选项卡的选中状态，并隐藏所有面板
      for (var LNN_j = 0; LNN_j < LNN_tabs.length; LNN_j++) {
        LNN_tabs[LNN_j].classList.remove(LNN_active);
        LNN_panels[LNN_j].classList.remove(LNN_show);
      }
      // 第二步：再设置当前元素的选中状态，并显示对应面板
      this.classList.add(LNN_active);
      var LNN_index = Array.prototype.indexOf.call(LNN_tabs, this);
      LNN_panels[LNN_index].classList.add(LNN_show);
    });
  }
}

// 页面载入后初始化新闻选项卡（换一组选择器即可复用到其他页面）
LNN_initTabs({
  LNN_tabs: '.LNN_tab',
  LNN_panels: '.LNN_panel',
  LNN_active: 'LNN_tab-active',
  LNN_show: 'LNN_panel-show'
});

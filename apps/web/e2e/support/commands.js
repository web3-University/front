// Cypress 自定义命令文件

// 示例命令：登录功能
Cypress.Commands.add("login", () => {
  // 可以在这里添加登录逻辑
});

// 示例命令：等待页面加载完成
Cypress.Commands.add("waitForPageLoad", () => {
  cy.get("main").should("be.visible");
});

// 示例命令：获取计数器值
Cypress.Commands.add("getCounter", () => {
  return cy
    .get("ol li")
    .first()
    .then(($el) => {
      const text = $el.text();
      // 提取数字部分
      const count = parseInt(text.match(/\d+/)[0], 10);
      return count;
    });
});

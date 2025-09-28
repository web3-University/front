// 首页端到端测试

describe("首页测试", () => {
  beforeEach(() => {
    // 访问首页
    cy.visit("/");
    // 等待页面加载完成
    cy.waitForPageLoad();
  });

  it("应该显示说明列表", () => {
    cy.get("ol").should("have.length", 1);
    cy.get("ol li").should("have.length", 2);
    cy.get("ol li").first().should("contain.text", "Get started by editing");
    cy.get("ol li")
      .eq(1)
      .should("contain.text", "Save and see your changes instantly");
  });

  it("应该有Deploy now按钮", () => {
    cy.get("a").contains("Deploy now").should("exist");
  });

  it("点击第一行文本应该增加计数器值", () => {
    // 获取初始计数器值
    cy.getCounter().then((initialCount) => {
      // 点击文本
      cy.get("ol li").first().click();
      // 验证计数器值增加了1
      cy.getCounter().should("eq", initialCount + 1);
    });
  });

  it("多次点击应该持续增加计数器值", () => {
    // 获取初始计数器值
    cy.getCounter().then((initialCount) => {
      // 点击3次
      cy.get("ol li").first().click().click().click();
      // 验证计数器值增加了3
      cy.getCounter().should("eq", initialCount + 3);
    });
  });
});

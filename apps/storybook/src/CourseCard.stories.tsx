import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "@storybook/test";
import { CourseCard } from "@web3-university/ui";

const meta: Meta<typeof CourseCard> = {
  title: "UI/CourseCard",
  component: CourseCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "课程卡片组件，用于展示课程信息，支持点击事件和插槽内容。",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    course: {
      description: "课程信息对象",
      control: "object",
    },
    onDetail: {
      description: "点击卡片时的回调函数",
      action: "onDetail",
    },
    clickable: {
      description: "是否可点击",
      control: "boolean",
    },
    children: {
      description: "插槽内容，通常用于放置操作按钮",
      control: "text",
    },
  },
  args: {
    onDetail: fn(),
    clickable: true,
  },
} satisfies Meta<typeof CourseCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// 默认课程数据
const defaultCourse = {
  id: "1",
  title: "区块链基础入门",
  category: "区块链",
  instructor: "张教授",
  rating: 4.8,
  students: 1234,
  price: 299,
  coverColor: "from-blue-400 to-purple-600",
};

// 基础故事
export const Default: Story = {
  args: {
    course: defaultCourse,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const card = canvas.getByRole("article");

    // 测试卡片点击功能
    await userEvent.click(card);
    await expect(args.onDetail).toHaveBeenCalledWith(defaultCourse);
  },
};

// 不同类别的课程
export const DifferentCategories: Story = {
  args: {},
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
      <CourseCard
        course={{
          id: "1",
          title: "智能合约开发",
          category: "区块链",
          instructor: "李老师",
          rating: 4.9,
          students: 856,
          price: 399,
          coverColor: "from-blue-400 to-purple-600",
        }}
      />
      <CourseCard
        course={{
          id: "2",
          title: "DeFi 协议分析",
          category: "DeFi",
          instructor: "王教授",
          rating: 4.7,
          students: 642,
          price: 499,
          coverColor: "from-green-400 to-blue-500",
        }}
      />
      <CourseCard
        course={{
          id: "3",
          title: "NFT 市场研究",
          category: "NFT",
          instructor: "陈博士",
          rating: 4.6,
          students: 423,
          price: 199,
          coverColor: "from-pink-400 to-red-500",
        }}
      />
    </div>
  ),
};

// 高评分课程
export const HighRated: Story = {
  args: {
    course: {
      id: "2",
      title: "以太坊高级开发",
      category: "区块链",
      instructor: "赵专家",
      rating: 4.9,
      students: 2156,
      price: 599,
      coverColor: "from-yellow-400 to-orange-500",
    },
  },
};

// 低价课程
export const LowPrice: Story = {
  args: {
    course: {
      id: "3",
      title: "加密货币入门",
      category: "基础",
      instructor: "刘老师",
      rating: 4.3,
      students: 3421,
      price: 99,
      coverColor: "from-teal-400 to-cyan-500",
    },
  },
};

// 不可点击状态
export const NonClickable: Story = {
  args: {
    course: defaultCourse,
    clickable: false,
  },
};

// 带操作按钮的卡片
export const WithActions: Story = {
  args: {
    course: defaultCourse,
    children: (
      <div className="flex gap-2">
        <button
          className="px-4 py-2 bg-blue-600 text-white border-none rounded-lg cursor-pointer text-sm font-medium hover:bg-blue-700 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            alert("购买课程");
          }}
        >
          立即购买
        </button>
        <button
          className="px-4 py-2 bg-transparent text-gray-500 border border-gray-300 rounded-lg cursor-pointer text-sm font-medium hover:bg-gray-50 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            alert("添加到收藏");
          }}
        >
          收藏
        </button>
      </div>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 测试操作按钮不会触发卡片点击
    const buyButton = canvas.getByText("立即购买");
    await userEvent.click(buyButton);

    const favoriteButton = canvas.getByText("收藏");
    await userEvent.click(favoriteButton);
  },
};

// 数据缺失的情况
export const MissingData: Story = {
  args: {
    course: {
      id: "4",
      title: "",
      category: "",
      instructor: "",
      rating: 0,
      students: 0,
      price: 0,
      coverColor: "",
    },
  },
};

// 极端数据情况
export const ExtremeData: Story = {
  args: {
    course: {
      id: "5",
      title: "这是一个非常非常长的课程标题，用来测试文本溢出和换行的情况",
      category: "超长类别名称测试",
      instructor: "拥有超长名字的教授先生",
      rating: 5.0,
      students: 99999,
      price: 9999,
      coverColor: "from-indigo-400 via-purple-500 to-pink-500",
    },
  },
};

// 所有变体展示
export const AllVariants: Story = {
  args: {},
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
      <CourseCard
        course={{
          id: "1",
          title: "基础课程",
          category: "入门",
          instructor: "新手导师",
          rating: 4.2,
          students: 100,
          price: 99,
          coverColor: "from-gray-400 to-gray-600",
        }}
      />
      <CourseCard
        course={{
          id: "2",
          title: "进阶课程",
          category: "进阶",
          instructor: "资深专家",
          rating: 4.7,
          students: 500,
          price: 299,
          coverColor: "from-blue-400 to-indigo-600",
        }}
      />
      <CourseCard
        course={{
          id: "3",
          title: "高级课程",
          category: "高级",
          instructor: "顶级大师",
          rating: 4.9,
          students: 1000,
          price: 599,
          coverColor: "from-purple-400 to-pink-600",
        }}
      >
        <button className="w-full py-3 bg-emerald-500 text-white border-none rounded-lg cursor-pointer font-semibold hover:bg-emerald-600 transition-colors">
          立即报名
        </button>
      </CourseCard>
    </div>
  ),
};

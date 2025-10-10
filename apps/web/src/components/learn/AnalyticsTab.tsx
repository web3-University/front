"use client";

import {
  BarChart3,
  TrendingUp,
  Calendar,
  Book,
  Flame,
  Users,
} from "lucide-react";

type DayOfWeek = {
  day: string;
  hours: number;
  percentage: number;
};

type TokenEarning = {
  label: string;
  amount: number;
  icon: React.ReactNode;
  color: string;
};

type CalendarDay = {
  date: number;
  isStudyDay: boolean;
  isToday?: boolean;
};

const weeklyStats: DayOfWeek[] = [
  { day: "周一", hours: 3, percentage: 75 },
  { day: "周二", hours: 1, percentage: 25 },
  { day: "周三", hours: 1, percentage: 25 },
  { day: "周四", hours: 1, percentage: 25 },
  { day: "周五", hours: 2, percentage: 50 },
  { day: "周六", hours: 4, percentage: 100 },
  { day: "周日", hours: 4, percentage: 100 },
];

const tokenEarnings: TokenEarning[] = [
  {
    label: "完成课程",
    amount: 150,
    icon: <Book className="h-5 w-5" />,
    color: "text-[#5B9EFF]",
  },
  {
    label: "连续学习",
    amount: 90,
    icon: <Flame className="h-5 w-5" />,
    color: "text-[#FF8A6B]",
  },
  {
    label: "社区贡献",
    amount: 100,
    icon: <Users className="h-5 w-5" />,
    color: "text-[#4CAF50]",
  },
];

// 生成日历数据（简化版）
const generateCalendarDays = (): CalendarDay[] => {
  const studyDays = [
    2, 3, 6, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 24, 25, 26, 27,
  ];
  const days: CalendarDay[] = [];

  for (let i = 1; i <= 28; i++) {
    days.push({
      date: i,
      isStudyDay: studyDays.includes(i),
      isToday: i === 23,
    });
  }

  return days;
};

const calendarDays = generateCalendarDays();
const weekDays = ["一", "二", "三", "四", "五", "六", "日"];

export default function AnalyticsTab() {
  const totalHours = 156;
  const totalEarnings = 340;
  const currentStreak = 23;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#2B2558]">学习分析</h2>

      {/* 统计卡片 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* 学习时长统计 */}
        <div className="rounded-2xl bg-gradient-to-br from-white/80 to-white/60 p-6 backdrop-blur-sm shadow-md ring-1 ring-white/60">
          <div className="mb-6 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#8A71FF]" />
            <h3 className="text-lg font-bold text-[#2B2558]">学习时长统计</h3>
          </div>

          {/* 总学习小时 */}
          <div className="mb-6 text-center">
            <div className="mb-1 text-5xl font-bold text-[#2B2558]">
              {totalHours}
            </div>
            <div className="text-sm text-[#6A6D94]">总学习小时</div>
          </div>

          {/* 每周统计条形图 */}
          <div className="space-y-3">
            {weeklyStats.map((stat, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-12 text-sm text-[#6A6D94]">{stat.day}</div>
                <div className="flex-1">
                  <div className="relative h-6 overflow-hidden rounded-full bg-[#E8E6F5]">
                    <div
                      className="h-full bg-gradient-to-r from-[#5B9EFF] to-[#4A8EFF] transition-all"
                      style={{ width: `${stat.percentage}%` }}
                    />
                  </div>
                </div>
                <div className="w-12 text-right text-sm font-medium text-[#2B2558]">
                  {stat.hours}h
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 代币收益分析 */}
        <div className="rounded-2xl bg-gradient-to-br from-white/80 to-white/60 p-6 backdrop-blur-sm shadow-md ring-1 ring-white/60">
          <div className="mb-6 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#8A71FF]" />
            <h3 className="text-lg font-bold text-[#2B2558]">代币收益分析</h3>
          </div>

          {/* 总收益 */}
          <div className="mb-6 text-center">
            <div className="mb-1 text-5xl font-bold text-[#FFB347]">
              {totalEarnings}
            </div>
            <div className="text-sm text-[#6A6D94]">累计获得 YD</div>
          </div>

          {/* 收益明细 */}
          <div className="space-y-4">
            {tokenEarnings.map((earning, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-xl bg-white/60 p-4 transition-all hover:bg-white/80"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-white to-white/50 ${earning.color} shadow-sm`}
                  >
                    {earning.icon}
                  </div>
                  <span className="font-medium text-[#2B2558]">
                    {earning.label}
                  </span>
                </div>
                <div className="text-lg font-bold text-[#4CAF50]">
                  +{earning.amount} YD
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 学习打卡日历 */}
      <div className="rounded-2xl bg-gradient-to-br from-white/80 to-white/60 p-6 backdrop-blur-sm shadow-md ring-1 ring-white/60">
        <div className="mb-6 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-[#8A71FF]" />
          <h3 className="text-lg font-bold text-[#2B2558]">学习打卡日历</h3>
        </div>

        {/* 连续天数提示 */}
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#FF8A6B]/10 to-[#FF7A5C]/5 p-4">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-[#FF8A6B]" />
            <span className="font-bold text-[#2B2558]">
              当前连击：{currentStreak}天
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-[#FF8A6B] px-3 py-1 text-xs font-medium text-white">
            <Flame className="h-3.5 w-3.5" />
            <span>火热状态</span>
          </div>
        </div>

        {/* 日历网格 */}
        <div>
          {/* 星期标题 */}
          <div className="mb-3 grid grid-cols-7 gap-2 text-center">
            {weekDays.map((day, index) => (
              <div key={index} className="text-sm font-medium text-[#6A6D94]">
                {day}
              </div>
            ))}
          </div>

          {/* 日期网格 */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`relative flex h-12 items-center justify-center rounded-lg text-sm font-medium transition-all ${
                  day.isStudyDay
                    ? "bg-gradient-to-br from-[#FF9800] to-[#F57C00] text-white shadow-md hover:shadow-lg"
                    : "bg-[#E8E6F5]/50 text-[#6A6D94] hover:bg-[#E8E6F5]"
                } ${day.isToday ? "ring-2 ring-[#8A71FF] ring-offset-2" : ""}`}
              >
                {day.date}
              </div>
            ))}
          </div>

          {/* 图例 */}
          <div className="mt-6 flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-gradient-to-br from-[#FF9800] to-[#F57C00]" />
              <span className="text-[#6A6D94]">学习日</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-[#E8E6F5]/50" />
              <span className="text-[#6A6D94]">休息日</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client"

import { useState } from "react"
import { Button } from "@/shared/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/shared/components/ui/card"
import { Input } from "@/shared/components/ui/input"
import { Slider } from "@/shared/components/ui/slider"
import { Progress } from "@/shared/components/ui/progress"

export default function DesignSystemPage() {
  const [sliderValue, setSliderValue] = useState([50])
  const [progressValue, setProgressValue] = useState(0)

  // Animate progress on mount
  useState(() => {
    const timer = setInterval(() => {
      setProgressValue((prev) => {
        if (prev >= 100) return 0
        return prev + 10
      })
    }, 1000)
    return () => clearInterval(timer)
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
            VioVietnamese Design System
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A playful, Duolingo-inspired design system with vibrant colors, rounded corners, and delightful interactions
          </p>
        </div>

        {/* Color Palette */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Color Palette</h2>
            <p className="text-gray-600">Our vibrant, energetic color system</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Primary - Pink */}
            <div className="space-y-3">
              <div className="h-32 bg-[#f40076] rounded-[20px] shadow-lg border-[3px] border-white flex items-center justify-center">
                <span className="text-white font-bold text-lg">Primary</span>
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-900">#f40076</p>
                <p className="text-sm text-gray-500">Vibrant Pink</p>
              </div>
            </div>

            {/* Secondary - Purple */}
            <div className="space-y-3">
              <div className="h-32 bg-[#B880FF] rounded-[20px] shadow-lg border-[3px] border-white flex items-center justify-center">
                <span className="text-white font-bold text-lg">Secondary</span>
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-900">#B880FF</p>
                <p className="text-sm text-gray-500">Purple</p>
              </div>
            </div>

            {/* Accent - Yellow */}
            <div className="space-y-3">
              <div className="h-32 bg-[#F9C449] rounded-[20px] shadow-lg border-[3px] border-white flex items-center justify-center">
                <span className="text-gray-900 font-bold text-lg">Accent</span>
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-900">#F9C449</p>
                <p className="text-sm text-gray-500">Golden Yellow</p>
              </div>
            </div>

            {/* Error - Red */}
            <div className="space-y-3">
              <div className="h-32 bg-[#ff4b4b] rounded-[20px] shadow-lg border-[3px] border-white flex items-center justify-center">
                <span className="text-white font-bold text-lg">Error</span>
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-900">#ff4b4b</p>
                <p className="text-sm text-gray-500">Error Red</p>
              </div>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Buttons</h2>
            <p className="text-gray-600">Chunky, playful buttons with bottom shadows</p>
          </div>

          {/* Variants */}
          <Card>
            <CardHeader>
              <CardTitle>Button Variants</CardTitle>
              <CardDescription>Different color schemes for different actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-4">
                <Button>Primary Button</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="accent">Accent</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
            </CardContent>
          </Card>

          {/* Sizes */}
          <Card>
            <CardHeader>
              <CardTitle>Button Sizes</CardTitle>
              <CardDescription>From small to extra large</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap items-center gap-4">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="xl">Extra Large</Button>
              </div>
            </CardContent>
          </Card>

          {/* States */}
          <Card>
            <CardHeader>
              <CardTitle>Button States</CardTitle>
              <CardDescription>Hover and interact with these buttons</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-4">
                <Button>Hover Me</Button>
                <Button disabled>Disabled</Button>
                <Button variant="secondary">Click Me</Button>
              </div>
              <p className="text-sm text-gray-500">
                Try hovering and clicking the buttons to see the lift and press animations!
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Cards */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Cards</h2>
            <p className="text-gray-600">Rounded containers with thick borders and playful shadows</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Default Card */}
            <Card variant="default">
              <CardHeader>
                <CardTitle>Default Card</CardTitle>
                <CardDescription>Clean and simple with subtle shadow</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  This is a standard card with rounded corners and a soft shadow.
                </p>
              </CardContent>
              <CardFooter>
                <Button size="sm" className="w-full">
                  Action
                </Button>
              </CardFooter>
            </Card>

            {/* Interactive Card */}
            <Card variant="interactive">
              <CardHeader>
                <CardTitle>Interactive Card</CardTitle>
                <CardDescription>Hover me for a lift effect!</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  This card has a bottom shadow and lifts on hover.
                </p>
              </CardContent>
              <CardFooter>
                <Button size="sm" variant="secondary" className="w-full">
                  Click Me
                </Button>
              </CardFooter>
            </Card>

            {/* Highlighted Card */}
            <Card variant="highlighted">
              <CardHeader>
                <CardTitle>Highlighted Card</CardTitle>
                <CardDescription>Pink accent border</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  This card uses the primary color for emphasis.
                </p>
              </CardContent>
              <CardFooter>
                <Button size="sm" className="w-full">
                  Start
                </Button>
              </CardFooter>
            </Card>

            {/* Success Card */}
            <Card variant="success">
              <CardHeader>
                <CardTitle>Success Card</CardTitle>
                <CardDescription>Purple accent for special features</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Great for premium features or highlighted content.
                </p>
              </CardContent>
              <CardFooter>
                <Button size="sm" variant="secondary" className="w-full">
                  Continue
                </Button>
              </CardFooter>
            </Card>

            {/* Accent Card */}
            <Card variant="accent">
              <CardHeader>
                <CardTitle>Accent Card</CardTitle>
                <CardDescription>Yellow border for special content</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Perfect for rewards, streaks, or premium features.
                </p>
              </CardContent>
              <CardFooter>
                <Button size="sm" variant="accent" className="w-full">
                  Unlock
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Form Elements */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Form Elements</h2>
            <p className="text-gray-600">Input fields with thick borders and smooth interactions</p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Inputs</CardTitle>
              <CardDescription>Text inputs with playful styling</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Default Input</label>
                <Input placeholder="Type something..." />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Email Input</label>
                <Input type="email" placeholder="your@email.com" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Disabled Input</label>
                <Input placeholder="Disabled state" disabled />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Error State</label>
                <Input placeholder="Invalid input" aria-invalid="true" />
                <p className="text-sm text-[#ff4b4b]">This field has an error</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Slider */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sliders</h2>
            <p className="text-gray-600">Chunky sliders with pink gradient fill</p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Range Slider</CardTitle>
              <CardDescription>Drag the thumb to adjust the value</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">Volume</span>
                  <span className="text-2xl font-bold text-[#f40076]">{sliderValue[0]}%</span>
                </div>
                <Slider
                  value={sliderValue}
                  onValueChange={setSliderValue}
                  min={0}
                  max={100}
                  step={1}
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">Fixed at 75%</span>
                  <span className="text-2xl font-bold text-[#f40076]">75%</span>
                </div>
                <Slider value={[75]} disabled />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Progress Bars */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Progress Bars</h2>
            <p className="text-gray-600">Track learning progress with gradient fills</p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Progress Indicators</CardTitle>
              <CardDescription>Show completion status with smooth animations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">Lesson Progress</span>
                  <span className="text-sm font-semibold text-[#f40076]">{progressValue}%</span>
                </div>
                <Progress value={progressValue} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">25% Complete</span>
                  <span className="text-sm font-semibold text-[#f40076]">25%</span>
                </div>
                <Progress value={25} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">50% Complete</span>
                  <span className="text-sm font-semibold text-[#f40076]">50%</span>
                </div>
                <Progress value={50} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">75% Complete</span>
                  <span className="text-sm font-semibold text-[#f40076]">75%</span>
                </div>
                <Progress value={75} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">100% Complete</span>
                  <span className="text-sm font-semibold text-[#B880FF]">100%</span>
                </div>
                <Progress value={100} indicatorClassName="from-[#B880FF] to-[#c799ff]" />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Typography */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Typography</h2>
            <p className="text-gray-600">Playful, friendly fonts optimized for Vietnamese</p>
          </div>

          {/* Font Families */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-display">Baloo 2</CardTitle>
                <CardDescription>Display & Headings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-display text-2xl font-bold text-gray-900 mb-2">
                  Học tiếng Việt
                </p>
                <p className="text-sm text-gray-600">
                  Playful and rounded, perfect for eye-catching headings and hero text.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-title">Mitr</CardTitle>
                <CardDescription>Titles & Subtitles</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-title text-2xl font-semibold text-gray-900 mb-2">
                  Học tiếng Việt
                </p>
                <p className="text-sm text-gray-600">
                  Clean and modern, ideal for section titles and important labels.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-body">Quicksand</CardTitle>
                <CardDescription>Body Text</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-body text-base text-gray-900 mb-2">
                  Học tiếng Việt thật thú vị và dễ dàng!
                </p>
                <p className="text-sm text-gray-600">
                  Friendly and readable, perfect for paragraphs and longer content.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-button">Varela Round</CardTitle>
                <CardDescription>Buttons & CTAs</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-button text-base uppercase tracking-wide text-gray-900 mb-2">
                  Bắt đầu học
                </p>
                <p className="text-sm text-gray-600">
                  Rounded and bold, designed for buttons and call-to-actions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-ui">Lexend</CardTitle>
                <CardDescription>UI Elements</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-ui text-sm text-gray-900 mb-2">
                  Labels, captions, và các thành phần UI
                </p>
                <p className="text-sm text-gray-600">
                  Optimized for readability in small sizes and UI components.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Text Sizes */}
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Text Sizes & Hierarchy</CardTitle>
              <CardDescription>From large displays to small captions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Display Text */}
              <div className="space-y-4 border-b pb-6">
                <p className="text-caption text-gray-500 uppercase tracking-wide">Display Text (Baloo 2)</p>
                <h1 className="text-display-1 font-display font-extrabold text-gray-900">
                  Học tiếng Việt
                </h1>
                <p className="text-sm text-gray-500 font-mono">text-display-1 | 56px | font-display | weight-800</p>
              </div>

              {/* Headings */}
              <div className="space-y-4 border-b pb-6">
                <p className="text-caption text-gray-500 uppercase tracking-wide">Headings (Baloo 2 & Mitr)</p>
                <h1 className="text-heading-1 font-display font-bold text-gray-900">
                  Heading 1 - Chào mừng bạn!
                </h1>
                <p className="text-sm text-gray-500 font-mono mb-3">text-heading-1 | 36px | font-display | weight-700</p>

                <h2 className="text-heading-2 font-title font-semibold text-gray-900">
                  Heading 2 - Bài học hôm nay
                </h2>
                <p className="text-sm text-gray-500 font-mono mb-3">text-heading-2 | 30px | font-title | weight-600</p>

                <h3 className="text-heading-3 font-title font-semibold text-gray-900">
                  Heading 3 - Từ vựng mới
                </h3>
                <p className="text-sm text-gray-500 font-mono">text-heading-3 | 24px | font-title | weight-600</p>
              </div>

              {/* Titles */}
              <div className="space-y-4 border-b pb-6">
                <p className="text-caption text-gray-500 uppercase tracking-wide">Titles (Mitr)</p>
                <h4 className="text-title font-title font-medium text-gray-900">
                  Title - Phần thực hành
                </h4>
                <p className="text-sm text-gray-500 font-mono mb-3">text-title | 20px | font-title | weight-500</p>

                <h5 className="text-title-sm font-title font-medium text-gray-900">
                  Title Small - Ghi chú quan trọng
                </h5>
                <p className="text-sm text-gray-500 font-mono">text-title-sm | 18px | font-title | weight-500</p>
              </div>

              {/* Body Text */}
              <div className="space-y-4 border-b pb-6">
                <p className="text-caption text-gray-500 uppercase tracking-wide">Body Text (Quicksand)</p>
                <p className="text-body-lg font-body text-gray-900">
                  Body Large - Học tiếng Việt thật thú vị! Với phương pháp học hiện đại, bạn sẽ tiến bộ nhanh chóng.
                </p>
                <p className="text-sm text-gray-500 font-mono mb-3">text-body-lg | 18px | font-body | weight-500</p>

                <p className="text-body font-body text-gray-900">
                  Body Regular - Đây là kích thước chữ tiêu chuẩn cho nội dung chính. Dễ đọc và thân thiện với người dùng.
                </p>
                <p className="text-sm text-gray-500 font-mono mb-3">text-body | 16px | font-body | weight-500</p>

                <p className="text-body-sm font-body text-gray-700">
                  Body Small - Văn bản phụ hoặc mô tả chi tiết. Vẫn dễ đọc nhưng không chiếm nhiều không gian.
                </p>
                <p className="text-sm text-gray-500 font-mono">text-body-sm | 15px | font-body | weight-500</p>
              </div>

              {/* UI Text */}
              <div className="space-y-4">
                <p className="text-caption text-gray-500 uppercase tracking-wide">UI Text (Lexend)</p>
                <p className="text-caption font-ui text-gray-600">
                  Caption - Chú thích ảnh, ghi chú nhỏ
                </p>
                <p className="text-sm text-gray-500 font-mono mb-3">text-caption | 14px | font-ui | weight-400</p>

                <p className="text-small font-ui text-gray-500">
                  Small - Labels, badges, metadata
                </p>
                <p className="text-sm text-gray-500 font-mono mb-3">text-small | 12px | font-ui | weight-400</p>

                <p className="text-tiny font-ui text-gray-400">
                  Tiny - Timestamps, fine print
                </p>
                <p className="text-sm text-gray-500 font-mono">text-tiny | 11px | font-ui | weight-400</p>
              </div>
            </CardContent>
          </Card>

          {/* Button Typography */}
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Button Typography</CardTitle>
              <CardDescription>Varela Round font for friendly CTAs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-4">
                <div className="space-y-2">
                  <Button size="lg">
                    Bắt đầu học
                  </Button>
                  <p className="text-tiny text-gray-500 font-mono">text-button-lg | 18px</p>
                </div>

                <div className="space-y-2">
                  <Button>
                    Tiếp tục
                  </Button>
                  <p className="text-tiny text-gray-500 font-mono">text-button | 16px</p>
                </div>

                <div className="space-y-2">
                  <Button size="sm">
                    Xem thêm
                  </Button>
                  <p className="text-tiny text-gray-500 font-mono">text-button-sm | 14px</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-body-sm font-body text-gray-700">
                  <strong>💡 Pro tip:</strong> Buttons use Varela Round font with uppercase text and letter-spacing for a playful, friendly appearance that encourages action.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Typography Usage Examples */}
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Real-world Examples</CardTitle>
              <CardDescription>How typography works together in actual layouts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Lesson Card Example */}
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-2xl border-3 border-ds-primary">
                <h2 className="text-heading-2 font-display font-bold text-gray-900 mb-2">
                  Bài 1: Chào hỏi
                </h2>
                <p className="text-title-sm font-title text-gray-700 mb-4">
                  Học cách chào hỏi và giới thiệu bản thân
                </p>
                <p className="text-body font-body text-gray-600 mb-6">
                  Trong bài học này, bạn sẽ được làm quen với các cụm từ chào hỏi phổ biến trong tiếng Việt. Hãy luyện tập thật nhiều để tự tin giao tiếp!
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-caption font-ui text-gray-500">15 phút</span>
                    <span className="text-caption font-ui text-gray-400">•</span>
                    <span className="text-caption font-ui text-gray-500">Sơ cấp</span>
                  </div>
                  <Button size="sm">Bắt đầu</Button>
                </div>
              </div>

              {/* Stats Card Example */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border-2 border-gray-200 text-center">
                  <p className="text-display-2 font-display font-extrabold text-ds-primary mb-1">127</p>
                  <p className="text-caption font-ui text-gray-600">Từ đã học</p>
                </div>
                <div className="bg-white p-4 rounded-xl border-2 border-gray-200 text-center">
                  <p className="text-display-2 font-display font-extrabold text-ds-secondary mb-1">12</p>
                  <p className="text-caption font-ui text-gray-600">Ngày liên tiếp</p>
                </div>
                <div className="bg-white p-4 rounded-xl border-2 border-gray-200 text-center">
                  <p className="text-display-2 font-display font-extrabold text-ds-accent mb-1">95%</p>
                  <p className="text-caption font-ui text-gray-600">Độ chính xác</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Spacing & Layout */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Spacing & Layout</h2>
            <p className="text-gray-600">Generous spacing for a comfortable learning experience</p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Border Radius Scale</CardTitle>
              <CardDescription>From subtle to super rounded</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#f40076] rounded-lg flex items-center justify-center text-white text-xs font-bold">
                  12px
                </div>
                <div className="w-16 h-16 bg-[#B880FF] rounded-xl flex items-center justify-center text-white text-xs font-bold">
                  16px
                </div>
                <div className="w-16 h-16 bg-[#F9C449] rounded-2xl flex items-center justify-center text-gray-900 text-xs font-bold">
                  20px
                </div>
                <div className="w-16 h-16 bg-[#ff4b4b] rounded-[24px] flex items-center justify-center text-white text-xs font-bold">
                  24px
                </div>
                <div className="w-16 h-16 bg-[#f40076] rounded-full flex items-center justify-center text-white text-xs font-bold">
                  Full
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Design Principles */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Design Principles</h2>
            <p className="text-gray-600">What makes this design system special</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card variant="highlighted">
              <CardHeader>
                <CardTitle>Playful & Friendly</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Rounded corners, vibrant colors, and bouncy animations make learning feel like play, not work.
                </p>
              </CardContent>
            </Card>

            <Card variant="success">
              <CardHeader>
                <CardTitle>Clear Hierarchy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Strong visual contrast and bold colors guide users' attention to what matters most.
                </p>
              </CardContent>
            </Card>

            <Card variant="accent">
              <CardHeader>
                <CardTitle>Delightful Interactions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Smooth animations and satisfying hover effects make every interaction feel rewarding.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center py-12 space-y-4">
          <h3 className="text-2xl font-bold text-gray-900">Ready to Start Building?</h3>
          <p className="text-gray-600 max-w-xl mx-auto">
            Check out the documentation in{" "}
            <code className="px-2 py-1 bg-gray-100 rounded text-[#f40076] font-mono text-sm">
              frontend/docs/design-system.md
            </code>{" "}
            and{" "}
            <code className="px-2 py-1 bg-gray-100 rounded text-[#f40076] font-mono text-sm">
              frontend/docs/design-migration-plan.md
            </code>
          </p>
          <div className="pt-4">
            <Button size="lg">Get Started</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

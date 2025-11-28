"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { useUserProfile } from "@/shared/hooks/use-user-profile"
import { useToast } from "@/shared/hooks/use-toast"
import {
  GraduationCap,
  BookOpen,
  Video,
  Headphones,
  Award,
  Sparkles,
  Crown,
  Heart,
  ShoppingBag,
  Coins,
  Calendar,
  MessageCircle,
  Zap,
  Gift,
  Star,
  Trophy,
  Flame,
  type LucideIcon
} from "lucide-react"

// Shop Item Interface
interface ShopItem {
  id: string
  name: string
  description: string
  price: number
  icon: LucideIcon
  category: "learning" | "premium" | "power-ups" | "cosmetic"
  badge?: string
  popular?: boolean
  discount?: number
}

// Shop Items Data
const shopItems: ShopItem[] = [
  // Learning Resources
  {
    id: "native-session-30",
    name: "30-Min Native Teacher Session",
    description: "One-on-one conversation practice with a native Vietnamese speaker. Perfect your pronunciation and fluency!",
    price: 500,
    icon: Video,
    category: "learning",
    popular: true,
  },
  {
    id: "native-session-60",
    name: "60-Min Native Teacher Session",
    description: "Extended conversation practice session with personalized feedback and lesson materials.",
    price: 900,
    icon: GraduationCap,
    category: "learning",
    badge: "Best Value",
  },
  {
    id: "grammar-guide",
    name: "Advanced Grammar Guide",
    description: "Comprehensive PDF guide covering advanced Vietnamese grammar patterns with 100+ examples.",
    price: 250,
    icon: BookOpen,
    category: "learning",
  },
  {
    id: "pronunciation-course",
    name: "Pronunciation Masterclass",
    description: "Video course with 20 lessons on Vietnamese tones, pronunciation, and accent reduction.",
    price: 400,
    icon: Headphones,
    category: "learning",
  },
  {
    id: "culture-package",
    name: "Vietnamese Culture Package",
    description: "Learn about traditions, customs, and etiquette through interactive stories and videos.",
    price: 300,
    icon: Sparkles,
    category: "learning",
  },
  {
    id: "idioms-ebook",
    name: "Common Idioms & Slang eBook",
    description: "Master 200+ everyday expressions, idioms, and slang used by native speakers.",
    price: 200,
    icon: MessageCircle,
    category: "learning",
  },

  // Premium Features
  {
    id: "premium-1month",
    name: "1 Month Premium Access",
    description: "Unlock all lessons, remove ads, access exclusive content, and get priority support.",
    price: 1000,
    icon: Crown,
    category: "premium",
    popular: true,
    badge: "Most Popular",
  },
  {
    id: "premium-3months",
    name: "3 Months Premium Access",
    description: "Extended premium access with 15% savings. All premium features for 3 months!",
    price: 2500,
    icon: Crown,
    category: "premium",
    discount: 15,
  },
  {
    id: "offline-mode",
    name: "Offline Mode (Lifetime)",
    description: "Download lessons and practice offline anytime, anywhere. One-time purchase!",
    price: 600,
    icon: Zap,
    category: "premium",
  },

  // Power-ups & Boosters
  {
    id: "streak-freeze",
    name: "Streak Freeze (3-pack)",
    description: "Protect your learning streak! Miss a day without losing progress. Get 3 freezes.",
    price: 150,
    icon: Flame,
    category: "power-ups",
  },
  {
    id: "double-coins",
    name: "Double Coins (7 days)",
    description: "Earn 2x coins from all activities for an entire week. Stack your rewards!",
    price: 350,
    icon: Coins,
    category: "power-ups",
  },
  {
    id: "skip-ahead",
    name: "Skip Ahead Pass",
    description: "Unlock any locked lesson instantly. Perfect for reviewing past topics!",
    price: 100,
    icon: Zap,
    category: "power-ups",
  },
  {
    id: "heart-refill",
    name: "Heart Refill (5-pack)",
    description: "Instant retry on failed exercises. Get 5 heart refills to keep learning!",
    price: 80,
    icon: Heart,
    category: "power-ups",
  },
  {
    id: "xp-boost",
    name: "XP Boost (24 hours)",
    description: "Earn 50% more XP from all activities for 24 hours. Level up faster!",
    price: 120,
    icon: Star,
    category: "power-ups",
  },

  // Cosmetic Items
  {
    id: "profile-frame-gold",
    name: "Golden Profile Frame",
    description: "Stand out with a shiny golden frame around your profile picture!",
    price: 200,
    icon: Award,
    category: "cosmetic",
  },
  {
    id: "profile-frame-diamond",
    name: "Diamond Profile Frame",
    description: "Ultra-rare sparkling diamond frame. Show off your dedication!",
    price: 500,
    icon: Trophy,
    category: "cosmetic",
    badge: "Rare",
  },
  {
    id: "custom-badge",
    name: "Custom Achievement Badge",
    description: "Create your own custom badge to display on your profile. Express yourself!",
    price: 300,
    icon: Star,
    category: "cosmetic",
  },
  {
    id: "theme-pack",
    name: "Premium Theme Pack",
    description: "Unlock 10 beautiful app themes: Dark mode, Pastel, Neon, and more!",
    price: 250,
    icon: Sparkles,
    category: "cosmetic",
  },
]

const categories = [
  { id: "all", name: "All Items", icon: ShoppingBag },
  { id: "learning", name: "Learning Resources", icon: BookOpen },
  { id: "premium", name: "Premium Features", icon: Crown },
  { id: "power-ups", name: "Power-ups & Boosters", icon: Zap },
  { id: "cosmetic", name: "Cosmetic Items", icon: Gift },
]

export default function ShopPage() {
  const { profile, loading } = useUserProfile()
  const { toast } = useToast()
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [purchasingItem, setPurchasingItem] = useState<string | null>(null)

  const userCoins = profile?.coins ?? 0

  // Filter items by category
  const filteredItems = selectedCategory === "all"
    ? shopItems
    : shopItems.filter(item => item.category === selectedCategory)

  const handlePurchase = async (item: ShopItem) => {
    if (!profile) {
      toast({
        title: "Authentication Required",
        description: "Please log in to make purchases.",
        variant: "destructive",
      })
      return
    }

    if (userCoins < item.price) {
      toast({
        title: "Insufficient Coins",
        description: `You need ${item.price - userCoins} more coins to purchase this item.`,
        variant: "destructive",
      })
      return
    }

    setPurchasingItem(item.id)

    // TODO: Implement actual purchase logic with Supabase
    // This would:
    // 1. Deduct coins from user_profiles
    // 2. Add item to user_purchases table
    // 3. Grant item benefits (e.g., premium access, power-ups)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    setPurchasingItem(null)

    toast({
      title: "Purchase Successful! <�",
      description: `You've purchased ${item.name}!`,
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ds-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading shop...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-ds-accent to-ds-accent-hover rounded-full mb-4 shadow-lg">
            <ShoppingBag className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-display-1 font-display font-extrabold text-gray-900 mb-3">
            Coin Shop
          </h1>
          <p className="text-body-lg font-body text-gray-600 max-w-2xl mx-auto mb-6">
            Redeem your hard-earned coins for premium content, power-ups, and exclusive items!
          </p>

          {/* User Coins Display */}
          <div className="inline-flex items-center gap-3 bg-white rounded-full px-8 py-4 shadow-lg border-3 border-ds-accent">
            <Coins className="w-8 h-8 text-ds-accent" />
            <div className="text-left">
              <p className="text-tiny font-ui text-gray-500 uppercase tracking-wide">Your Balance</p>
              <p className="text-heading-2 font-display font-bold text-ds-accent">
                {userCoins.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => {
            const Icon = category.icon
            const isActive = selectedCategory === category.id

            return (
              <Button
                key={category.id}
                variant={isActive ? "default" : "outline"}
                size="lg"
                onClick={() => setSelectedCategory(category.id)}
                className={isActive ? "" : "bg-white hover:bg-gray-50"}
              >
                <Icon className="w-4 h-4 mr-2" />
                {category.name}
              </Button>
            )
          })}
        </div>

        {/* Shop Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const Icon = item.icon
            const canAfford = userCoins >= item.price
            const isPurchasing = purchasingItem === item.id
            const finalPrice = item.discount
              ? Math.floor(item.price * (1 - item.discount / 100))
              : item.price

            return (
              <Card
                key={item.id}
                variant={item.popular ? "highlighted" : "default"}
                className="relative overflow-hidden transition-all hover:scale-[1.02]"
              >
                {/* Popular/Badge Indicator */}
                {(item.badge || item.popular) && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-ds-accent text-ds-accent-foreground font-button text-xs uppercase">
                      {item.badge || "Popular"}
                    </Badge>
                  </div>
                )}

                {/* Discount Badge */}
                {item.discount && (
                  <div className="absolute top-4 left-4 z-10">
                    <Badge className="bg-ds-error text-white font-button text-xs uppercase">
                      {item.discount}% OFF
                    </Badge>
                  </div>
                )}

                <CardHeader>
                  <div className="flex items-start gap-4 mb-3">
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-ds-primary to-ds-primary-light flex items-center justify-center shadow-md">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-title font-title text-gray-900 mb-1">
                        {item.name}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Coins className="w-4 h-4 text-ds-accent" />
                        {item.discount ? (
                          <div className="flex items-center gap-2">
                            <span className="text-body font-body font-bold text-ds-accent">
                              {finalPrice.toLocaleString()}
                            </span>
                            <span className="text-body-sm font-body text-gray-400 line-through">
                              {item.price.toLocaleString()}
                            </span>
                          </div>
                        ) : (
                          <span className="text-body font-body font-bold text-ds-accent">
                            {item.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <CardDescription className="text-body-sm font-body text-gray-600">
                    {item.description}
                  </CardDescription>
                </CardContent>

                <CardFooter>
                  <Button
                    variant={canAfford ? "default" : "outline"}
                    size="lg"
                    className="w-full"
                    disabled={!canAfford || isPurchasing}
                    onClick={() => handlePurchase(item)}
                  >
                    {isPurchasing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Purchasing...
                      </>
                    ) : canAfford ? (
                      <>
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Purchase
                      </>
                    ) : (
                      <>
                        <Coins className="w-4 h-4 mr-2" />
                        Need {(finalPrice - userCoins).toLocaleString()} more
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-heading-3 font-title font-semibold text-gray-900 mb-2">
              No Items Found
            </h3>
            <p className="text-body font-body text-gray-600">
              Try selecting a different category to see available items.
            </p>
          </div>
        )}

        {/* How to Earn Coins Info */}
        <Card className="mt-12 max-w-4xl mx-auto bg-gradient-to-br from-ds-accent-light to-white border-3 border-ds-accent">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-ds-accent rounded-full flex items-center justify-center">
                <Coins className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-heading-3 font-display font-bold text-gray-900">
                  How to Earn More Coins
                </CardTitle>
                <CardDescription className="text-body-sm font-body text-gray-600">
                  Complete these activities to stack up coins!
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 bg-white rounded-xl p-4">
                <div className="w-10 h-10 bg-ds-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-5 h-5 text-ds-primary" />
                </div>
                <div>
                  <h4 className="text-title-sm font-title font-semibold text-gray-900 mb-1">
                    Complete Lessons
                  </h4>
                  <p className="text-body-sm font-body text-gray-600">
                    Earn 50-100 coins per completed lesson
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white rounded-xl p-4">
                <div className="w-10 h-10 bg-ds-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Flame className="w-5 h-5 text-ds-secondary" />
                </div>
                <div>
                  <h4 className="text-title-sm font-title font-semibold text-gray-900 mb-1">
                    Maintain Streaks
                  </h4>
                  <p className="text-body-sm font-body text-gray-600">
                    Get bonus coins for daily learning streaks
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white rounded-xl p-4">
                <div className="w-10 h-10 bg-ds-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-5 h-5 text-ds-accent" />
                </div>
                <div>
                  <h4 className="text-title-sm font-title font-semibold text-gray-900 mb-1">
                    Perfect Scores
                  </h4>
                  <p className="text-body-sm font-body text-gray-600">
                    2x coins for scoring 100% on exercises
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white rounded-xl p-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="text-title-sm font-title font-semibold text-gray-900 mb-1">
                    Daily Challenges
                  </h4>
                  <p className="text-body-sm font-body text-gray-600">
                    Complete daily tasks for extra rewards
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

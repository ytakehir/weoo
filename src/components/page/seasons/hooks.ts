import { zodResolver } from '@hookform/resolvers/zod'
import type { User } from '@supabase/supabase-js'
import { format, isToday, isYesterday } from 'date-fns'
import { ja } from 'date-fns/locale/ja'
import { useRouter } from 'next/navigation'
import { useEffect, useReducer, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import type { MissionRow } from '@/lib/supabase/actions/mission'
import { createPost, getPostsByMission, getPostsCountByMission, type PostWithPage } from '@/lib/supabase/actions/post'
import { createClient } from '@/lib/supabase/client'

export type PostForm = {
  file?: FileList
  caption: string
  isPublic: boolean
}

export const useHome = (user: User | null, missions: MissionRow[] | null) => {
  const router = useRouter()
  const supabase = createClient()
  const [active, setActive] = useState(0)
  const [mission, setMission] = useState<MissionRow | undefined>(missions?.[0])
  const [postCount, setPostCount] = useState<number>(0)
  const [isLatest, setIsLatest] = useState<boolean>(true)
  const [isPosted, setIsPosted] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState<boolean>(true)
  const [isOpenPlanModal, setIsOpenPlanModal] = useState<boolean>(false)
  const [isOpenPostModal, setIsOpenPostModal] = useState<boolean>(false)
  const [posts, setPosts] = useState<PostWithPage>()
  const [isPending, startTransition] = useTransition()
  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case 'INCREMENT':
          if (posts?.total && state.count >= posts?.total / posts?.limit) return { count: state.count }
          return { count: state.count + 1 }
        case 'DECREMENT':
          if (state.count <= 1) return { count: 1 }
          return { count: state.count - 1 }
        default:
          return state
      }
    },
    { count: 1 }
  )

  const schema = z.object({
    file: z.custom<FileList>().optional(),
    caption: z.string().min(0).max(20, { message: 'キャプションは20文字までです' }),
    isPublic: z.boolean()
  })

  const defaultValues: PostForm = {
    caption: '',
    isPublic: false
  }

  const methods = useForm<PostForm>({
    mode: 'onTouched',
    defaultValues: defaultValues,
    resolver: zodResolver(schema)
  })

  useEffect(() => {
    setIsPosted(posts?.items.some((post) => post.profile_id === user?.id) ?? false)
  }, [posts, user?.id])

  useEffect(() => {
    const m = missions?.[active]
    if (!m) return
    setMission(m)
    let canceled = false
    ;(async () => {
      const count = await getPostsCountByMission(m.id)
      const p = await getPostsByMission(m.id, isLatest ? 'desc' : 'asc')
      if (!canceled) {
        setPostCount(count ?? 0)
        if (p) setPosts(p)
      }
    })()
    return () => {
      canceled = true
    }
  }, [active, missions, isLatest])

  useEffect(() => {
    if (isPending) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
    return () => {
      document.body.classList.remove('overflow-hidden')
    }
  }, [isPending])

  const judgeDate = () => {
    const usedAt = missions?.[active]?.used_at
    if (!usedAt) return '今日'

    const date = new Date(usedAt)
    switch (true) {
      case isToday(date):
        return '今日'
      case isYesterday(date):
        return '昨日'
      default:
        return format(date, 'E曜日', { locale: ja })
    }
  }

  const onSubmit = async (data: PostForm) => {
    try {
      const { file, caption, isPublic } = data
      window.scrollTo({ top: 0 })
      startTransition(async () => {
        try {
          if (!file || !mission) return

          const {
            data: { user },
            error: userErr
          } = await supabase.auth.getUser()
          if (userErr || !user) return

          const ext = file[0].name.split('.').pop() ?? 'webp'
          const now = new Date()
          const y = now.getUTCFullYear()
          const m = String(now.getUTCMonth() + 1).padStart(2, '0')
          const d = String(now.getUTCDate()).padStart(2, '0')
          const objectPath = `${user.id}/${y}/${m}/${d}/${crypto.randomUUID()}.${ext}`

          const { error: upErr } = await supabase.storage.from('posts').upload(objectPath, file[0], { upsert: false })

          if (upErr) return

          await createPost({
            userId: user.id,
            missionId: mission.id,
            imageUrl: objectPath,
            caption: caption,
            isPublic: isPublic
          })

          setIsPosted(true)
          router.refresh()
        } catch (e) {
          console.error('[onUpload]', e)
        }
      })
      methods.reset()

      setIsOpenPostModal(false)
    } catch (error) {
      console.error('error:', error)
    }
  }

  return {
    router,
    active,
    setActive,
    mission,
    postCount,
    isLatest,
    setIsLatest,
    isPosted,
    isOpen,
    setIsOpen,
    isOpenPlanModal,
    setIsOpenPlanModal,
    isOpenPostModal,
    setIsOpenPostModal,
    posts,
    isPending,
    state,
    dispatch,
    methods,
    judgeDate,
    onSubmit
  }
}

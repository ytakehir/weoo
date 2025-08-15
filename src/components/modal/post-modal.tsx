import { differenceInCalendarDays } from 'date-fns'
import { Sparkles, X } from 'lucide-react'
import { cn } from '@/lib/tailwind'

type Props = {
  isOpen: boolean
  onIsOpen: () => void
  onSubscribe: () => void
  trailEndDate: Date
}

export function PostModal({ isOpen, onIsOpen, onSubscribe, trailEndDate }: Props) {
  return (
    <dialog id='plan-modal' className={cn('modal', isOpen && 'modal-open')}>
      <div className='modal-box relative flex flex-col overflow-visible bg-[color-mix(in_srgb,var(--color-primary)_25%,white)] p-0'>
        <form method='dialog'>
          <button
            type='submit'
            className='btn btn-xs btn-circle -top-2 -right-2 absolute border-none bg-base-100/50'
            onClick={onIsOpen}
          >
            <X className='size-4 text-base-content/70' />
          </button>
        </form>
        {/* <div className='flex w-full items-center justify-center rounded-t-box bg-primary'>
          <Image src={'/logo.png'} alt='logo' width={256} height={256} />
        </div> */}
        <div className='flex flex-col items-center justify-center p-6'>
          <h3 className='text-center font-bold text-lg'>
            あと{differenceInCalendarDays(trailEndDate, new Date())}日で無料トライアルが
            <br />
            終了します...🥲
          </h3>
          <p className='mt-2 text-base-content/70 text-xs'>終了後は全ての機能がご利用できなくなります</p>
          <div className='divider mt-4 mb-0 text-base-content/70 text-xs'>もし、サブスクに登録すると...</div>
          <ul className='mt-2 flex flex-col gap-y-1 text-xs leading-relaxed'>
            <li>
              <Sparkles className='me-2 inline-block size-4 text-warning' />
              <span className='text-base-content'>追加で30日間無料で利用できる</span>
            </li>
            <li>
              <Sparkles className='me-2 inline-block size-4 text-warning' />
              <span className='text-base-content'>一週間（月〜日）のお題にいつでも投稿できる</span>
            </li>
            <li>
              <Sparkles className='me-2 inline-block size-4 text-warning' />
              <span className='text-base-content'>投稿しなくてもみんなの投稿が見える</span>
            </li>
            <li>
              <Sparkles className='me-2 inline-block size-4 text-warning' />
              <span className='text-base-content'>達成したお題をカレンダー形式で閲覧できる</span>
            </li>
          </ul>
          <div className='tooltip tooltip-open tooltip-neutral mt-15 w-full before:p-2' data-tip='追加 30日間無料✨'>
            <button type='button' className='btn btn-primary w-full' onClick={onSubscribe}>
              月額500円で始める
            </button>
          </div>
          <p className='mt-2 text-right text-base-content/70 text-xs'>いつでも退会・キャンセル可能</p>
          <p className='mt-2 text-right text-base-content/70 text-xs'>無料期間終了後は自動で月額500円課金されます。</p>
        </div>
      </div>
    </dialog>
  )
}

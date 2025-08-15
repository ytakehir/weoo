import { Sparkles, X } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/tailwind'

type Props = {
  isOpen: boolean
  onIsOpen: () => void
  onSubscribe: () => void
}

export function PlanModal({ isOpen, onIsOpen, onSubscribe }: Props) {
  return (
    <dialog id='plan-modal' className={cn('modal', isOpen && 'modal-open')}>
      <div className='modal-box relative flex flex-col overflow-visible p-0'>
        <form method='dialog'>
          {/* if there is a button in form, it will close the modal */}
          <button
            type='submit'
            className='btn btn-xs btn-circle -top-2 -right-2 absolute border-none bg-base-100/50'
            onClick={onIsOpen}
          >
            <X className='size-4 text-base-content/70' />
          </button>
        </form>
        <div className='flex w-full items-center justify-center rounded-t-box bg-primary py-6'>
          <Image src={'/logo.png'} alt='logo' width={128} height={128} />
        </div>
        <div className='flex flex-col items-center justify-center p-6'>
          <h3 className='text-center font-bold text-lg'>
            サブスク登録をして
            <br />
            思い出を記録しよう！
          </h3>
          <ul className='mt-6 flex flex-col gap-y-1 text-xs leading-relaxed'>
            <li>
              <Sparkles className='me-2 inline-block size-4 text-warning' />
              <span className='text-base-content'>追加で1週間無料で利用できる</span>
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
          <div className='tooltip tooltip-open tooltip-neutral mt-15 w-full before:p-2' data-tip='追加 1週間無料✨'>
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

import { Check, Sparkles, X } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/tailwind'

type Props = {
  isOpen: boolean
  onIsOpen: () => void
  onSignin: () => void
  onSubscribe: () => void
}

export function SigninModal({ isOpen, onIsOpen, onSignin, onSubscribe }: Props) {
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
            会員登録をして
            <br />
            今日のお題にチャレンジしよう！
          </h3>
          <ul className='mt-4 flex flex-col gap-y-1 text-xs leading-relaxed'>
            <li>
              <Check className='me-2 inline-block size-4 text-success' />
              <span className='text-base-content'>毎日違うお題が見れる</span>
            </li>
            <li>
              <Check className='me-2 inline-block size-4 text-success' />
              <span className='text-base-content'>みんなの写真が見れる</span>
            </li>
            <li>
              <Check className='me-2 inline-block size-4 text-success' />
              <span className='text-base-content'>達成したお題・写真を見返せる</span>
            </li>

            <li className='text-center'>
              <span className='text-base-content/50'>有料プラン限定</span>
            </li>
            <li>
              <Sparkles className='me-2 inline-block size-4 text-warning' />
              <span className='text-base-content'>一週間（月〜日）のお題にいつでも投稿できる</span>
            </li>
            <li>
              <Sparkles className='me-2 inline-block size-4 text-warning' />
              <span className='text-base-content'>達成したお題をカレンダー形式で閲覧できる</span>
            </li>
          </ul>
          <button type='button' className='btn btn-neutral btn-soft mt-5 w-full' onClick={onSignin}>
            1週間無料で体験する（会員登録のみ）
          </button>
          <div
            className='tooltip tooltip-bottom tooltip-open tooltip-neutral mt-2 mb-10 w-full drop-shadow-md before:p-2 before:text-xs'
            data-tip='期間限定 2週間無料✨'
          >
            <button type='button' className='btn btn-primary w-full' onClick={onSubscribe}>
              月額500円で始める
            </button>
          </div>
          <p className='mt-2 text-right text-base-content/70 text-xs'>いつでも退会・キャンセル可能</p>
          <p className='mt-2 text-right text-base-content/70 text-xs'>
            期間限定期間終了後は自動で月額500円課金されます。
          </p>
        </div>
      </div>
    </dialog>
  )
}

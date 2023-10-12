import React, { ReactElement } from 'react'
import TailIn from '../TailIn'

export default function TailWrapper({ children, showTail, isSent }: { children: ReactElement, showTail: boolean, isSent: boolean }) {
    return (
        <div className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}>
            <div className="flex">
                {showTail && !isSent ?
                    (
                        <div className={`inline-block h-full ${isSent ? 'text-outgoing-background' : 'text-incoming-background'} float-left`}>
                            <TailIn />
                        </div>
                    ) :
                    (
                        <div className='w-[8px] inline-block'></div>
                    )
                }
                <div className={`${isSent ? 'bg-outgoing-background' : 'bg-incoming-background'} inline-block rounded-b-lg  ${showTail ? isSent ? 'rounded-tl-lg' : 'rounded-tr-lg' : 'rounded-t-lg'} shadow-message`}>
                    {children}
                </div>
                {showTail && isSent ?
                    (
                        <div className={`inline-block h-full ${isSent ? 'text-outgoing-background' : 'text-incoming-background'} float-right scale-x-[-1]`}>
                            <TailIn />
                        </div>
                    ) :
                    (
                        <div className='w-[8px] inline-block'></div>
                    )
                }
            </div>
        </div>
    )
}

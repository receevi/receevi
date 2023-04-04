import React, { ReactElement } from 'react'
import TailIn from '../TailIn'

export default function TailWrapper({ children, showTail }: { children: ReactElement, showTail: boolean }) {
    return (
        <div>
            <div className="inline-block">
                {showTail ?
                    (
                        <div className="inline-block h-full text-incoming-background float-left">
                            <TailIn />
                        </div>
                    ) :
                    (
                        <div className='w-[8px] inline-block'></div>
                    )
                }
                <div className={`bg-incoming-background inline-block p-2 rounded-b-lg rounded-tr-lg ${showTail ? '' : 'rounded-tl-lg'} shadow-message`}>
                    {children}
                </div>
            </div>
        </div>
    )
}

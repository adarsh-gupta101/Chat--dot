import { IconLoader2 } from '@tabler/icons-react'
import React from 'react'

function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin">
        <IconLoader2 className="w-8 h-8 text-blue-500" />
      </div>
    </div>
  )
}

export default Loading


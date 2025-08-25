"use client"

import * as Dialog from "@radix-ui/react-dialog"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChatState, DataPreview } from "@/types/chat"

interface ChatModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

const overlayVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1 }
}

export function ChatModal({
  isOpen,
  onClose,
  children
}: ChatModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                initial="closed"
                animate="open"
                exit="closed"
                variants={overlayVariants}
              />
            </Dialog.Overlay>
            <Dialog.Content className="fixed inset-4 bg-gray-900/90 border border-gray-800 rounded-lg shadow-xl z-50 flex flex-col">
              {/* <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <Dialog.Title className="text-lg font-semibold">
                  Chat with Your Data
                </Dialog.Title>
                <Dialog.Close asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </Dialog.Close>
              </div> */}
              <div className="flex-1 overflow-hidden">
                {children}
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
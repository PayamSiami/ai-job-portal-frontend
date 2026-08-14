'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent } from '../ui/dialog';

interface TemplatePreviewProps {
  resume: string;
  open: boolean;
  onOpenChange: (value: boolean) => void;
}

export function TemplatePreviewDialog({ resume, open, onOpenChange }: TemplatePreviewProps) {

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent
        size="fullscreen"
        className="overflow-hidden p-0"
      >



        <div className="flex-1 min-h-0 overflow-hidden px-4">
          <Card
            className={"overflow-hidden transition-all duration-300 w-full flex flex-col h-full"}
          >
            <CardContent className="p-0 h-full">
              <div className="relative h-full">
                {/* PDF Viewer */}
                <div
                  className={"w-full bg-gray-100 flex justify-center items-start min-h-175 max-h-full overflow-auto p-4"}
                >
                  {resume ? (
                    <div
                      className="bg-white
                shadow-xl
                w-full
                max-w-198.5
                min-h-280.75
                shrink-0
              "
                    >
                      <iframe
                        src={`${resume}#toolbar=1&navpanes=0&scrollbar=1`}
                        title="Resume PDF Preview"
                        className="
                  block
                  w-full
                  h-280.75
                  border-0
                  rounded-sm
                "
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-full min-h-125 text-gray-500">
                      No preview available
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
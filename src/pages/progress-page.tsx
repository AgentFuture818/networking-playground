import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useProgress } from '@/context/progress-context'
import { encodeProgressCode, progressToFileJson, type CodeError } from '@/lib/progress'
import { allCompletableIds, codeErrorCopy } from '@/content/catalog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'

export function ProgressPage() {
  const { state, writeError, importCode, importFileText, resetProgress, completedCount, totalCount } =
    useProgress()
  const [paste, setPaste] = useState('')
  const [importMsg, setImportMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const [reading, setReading] = useState(false)
  const code = encodeProgressCode(state)

  function explain(error: CodeError | string): string {
    return codeErrorCopy[error] ?? '匯入失敗。'
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
      setImportMsg({ ok: false, text: '複製唔到剪貼簿。請手動全選進度碼。' })
    }
  }

  function downloadJson() {
    const blob = new Blob([progressToFileJson(state)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '網絡傳送實驗-進度.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  function onImportCode() {
    const result = importCode(paste)
    if (result.ok) {
      setImportMsg({ ok: true, text: '進度碼已匯入，並寫入呢個瀏覽器嘅 localStorage。' })
    } else {
      setImportMsg({ ok: false, text: explain(result.error) })
    }
  }

  function onFile(file: File | undefined) {
    if (!file) return
    setReading(true)
    setImportMsg(null)
    const reader = new FileReader()
    reader.onload = () => {
      setReading(false)
      const text = typeof reader.result === 'string' ? reader.result : ''
      const result = importFileText(text)
      if (result.ok) {
        setImportMsg({ ok: true, text: `已由「${file.name}」匯入進度。` })
      } else {
        setImportMsg({ ok: false, text: explain(result.error) })
      }
    }
    reader.onerror = () => {
      setReading(false)
      setImportMsg({ ok: false, text: '讀檔失敗。請再試過，或者改用進度碼。' })
    }
    reader.readAsText(file)
  }

  const empty = completedCount === 0 && Object.keys(state.scores).length === 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">進度</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
          預設存在呢個 origin 嘅 localStorage，key 係 <span className="font-mono">netlab.progress.v1</span>
          ，唔用 cookie、冇帳號。進度碼係同一份資料嘅壓縮字串，方便換瀏覽器。
        </p>
      </div>

      {state.storageError ? (
        <Alert variant="destructive">
          <AlertTitle>本機進度讀唔到</AlertTitle>
          <AlertDescription>{explain(state.storageError)}</AlertDescription>
        </Alert>
      ) : null}
      {writeError ? (
        <Alert variant="destructive">
          <AlertTitle>寫唔入 localStorage</AlertTitle>
          <AlertDescription>{explain(writeError)}</AlertDescription>
        </Alert>
      ) : null}

      {empty ? (
        <Alert>
          <AlertTitle>未有進度</AlertTitle>
          <AlertDescription>
            做完至少一節並且標記完成，或者喺練習全對，呢度先會有紀錄。
            <Link to="/" className="ml-1 underline">
              返總覽開始
            </Link>
          </AlertDescription>
        </Alert>
      ) : (
        <p className="text-sm">
          已完成 {completedCount}/{totalCount} 項。
          {allCompletableIds()
            .filter((id) => state.completed.includes(id))
            .join('、') || '—'}
        </p>
      )}

      <section className="space-y-2">
        <Label htmlFor="code">進度碼</Label>
        <Textarea id="code" readOnly value={code} rows={4} />
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => void copyCode()}>{copied ? '已複製' : '複製進度碼'}</Button>
          <Button variant="outline" onClick={downloadJson}>
            下載 JSON
          </Button>
        </div>
      </section>

      <section className="space-y-2">
        <Label htmlFor="paste">匯入進度碼</Label>
        <Textarea
          id="paste"
          value={paste}
          onChange={(e) => setPaste(e.target.value)}
          placeholder="貼 NL1. 開頭嗰串"
          rows={4}
        />
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={onImportCode}>由進度碼還原</Button>
          <Label className="text-muted-foreground cursor-pointer text-sm underline">
            {reading ? '讀緊檔案…' : '或者上傳 JSON'}
            <input
              type="file"
              accept="application/json,.json"
              className="sr-only"
              onChange={(e) => onFile(e.target.files?.[0])}
            />
          </Label>
        </div>
        {importMsg ? (
          <Alert variant={importMsg.ok ? 'default' : 'destructive'}>
            <AlertTitle>{importMsg.ok ? '匯入成功' : '匯入失敗'}</AlertTitle>
            <AlertDescription>{importMsg.text}</AlertDescription>
          </Alert>
        ) : null}
      </section>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive">清空本機進度</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>確定清空？</DialogTitle>
            <DialogDescription>
              會刪除呢個瀏覽器 localStorage 入面嘅實驗進度。進度碼如果已經抄低，仍然可以匯返。
            </DialogDescription>
          </DialogHeader>
          <div className="mt-3 flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline">取消</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="destructive" onClick={resetProgress}>
                清空
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

import { FC, useState } from "react";
import Section from "../../components/Section";
import { TonConnectUI } from "@tonconnect/ui";
import { number, object, string } from 'yup'
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import BigNumber from "bignumber.js";

const schema = object({
  toAddress: string().required(),
  amount: number().positive(),
})

const SendTransactionSection: FC<{ client: TonConnectUI }> = ({ client }) => {
  const [result, setResult] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  })

  const handleConfirm = handleSubmit(async (data) => {
    setResult('')
    setLoading(true)
    try {
      const res = await client.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 3 * 60, // 3 minutes
        messages: [
          {
            address: data.toAddress,
            amount: new BigNumber(data.amount || 0).shiftedBy(9).toString(), //Toncoin in nanotons
            // amount: data.amount?.toString() ?? ''
          }
        ]
      })
      setResult(JSON.stringify(res, null, 2))
    } catch (e: any) {
      setErr(e.message || e.toString())
    } finally {
      setLoading(false)
    }
  })

  return ( 
    <Section title="Send Transaction">
      <div className="flex gap-2">
        <form className="flex-none w-[240px] mt-4 flex flex-col gap-2" onSubmit={handleConfirm}>
          <div className="form-control">
            <div className="label">
              <span className="label-text">To Address</span>
            </div>
            <input
              {...register('toAddress')}
              className="input input-sm input-bordered grow"
            />
            {errors.toAddress && (
              <div className="label">
                <span className="label-text-alt text-error">{errors.toAddress.message}</span>
              </div>
            )}
          </div>
          <div className="form-control">
            <div className="label">
              <span className="label-text">Amount</span>
            </div>
            <input
              {...register('amount')}
              className="input input-sm input-bordered grow"
              type="number"
            />
            {errors.amount && (
              <div className="label">
                <span className="label-text-alt text-error">{errors.amount.message}</span>
              </div>
            )}
          </div>
          <button className="btn btn-primary" onClick={handleConfirm}>
            Send
          </button>
        </form>
        <div className="divider divider-horizontal"></div>
        <div className="flex-1 overflow-hidden">
          <div className="font-bold">Result</div>
          <pre className="mt-2 bg-base-200 p-2 rounded-md overflow-auto">
            {loading && <span>Loading...</span>}
            {!loading && result && (
              <span className="text-success">{result}</span>
            )}
            {!loading && err && (
              <span className="text-error">{err}</span>
            )}
          </pre>
        </div>
      </div>
    </Section>
  )
}

export default SendTransactionSection;

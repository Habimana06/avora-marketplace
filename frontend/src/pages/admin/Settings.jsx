import { useForm } from 'react-hook-form'

export default function AdminSettings() {
  const { register, handleSubmit } = useForm()

  const onSubmit = (data) => {
    console.log('Settings:', data)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-3xl mb-2">Settings</h1>
        <p className="text-gray-600">Platform configuration.</p>
      </div>

      <div className="card-premium p-6 max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Site Name</label>
            <input {...register('siteName')} defaultValue="AVORA" className="w-full px-4 py-2 border" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Currency</label>
            <select {...register('currency')} className="w-full px-4 py-2 border">
              <option value="RWF">RWF - Rwandan Franc</option>
              <option value="USD">USD - US Dollar</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Shipping Zones</label>
            <textarea {...register('shippingZones')} className="w-full px-4 py-2 border" rows={3} />
          </div>
          <button type="submit" className="btn-primary">Save Settings</button>
        </form>
      </div>
    </div>
  )
}
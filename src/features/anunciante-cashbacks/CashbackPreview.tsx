
import { CashbackCampaign } from './types';

const PREVIEW_FIELDS: (keyof CashbackCampaign)[] = [
  'title',
  'description', 
  'cashback_percentage',
  'category',
  'end_date',
  'minimum_purchase'
];

interface CashbackPreviewProps {
  formData: Partial<CashbackCampaign>;
}

export const CashbackPreview: React.FC<CashbackPreviewProps> = ({ formData }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Preview da Campanha</h3>
      
      <div className="border rounded-lg p-4 bg-gray-50">
        <div className="space-y-3">
          {PREVIEW_FIELDS.map((field) => (
            <div key={field} className="flex justify-between">
              <span className="font-medium capitalize">
                {field.replace('_', ' ')}:
              </span>
              <span className="text-gray-600">
                {formData[field] || 'Não informado'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CashbackPreview;

param(
    [string]$UserId = "<YOUR_USER_ID>",
    [string]$PackageId = "<YOUR_PACKAGE_ID>"
)

# Compra de Rifas
$purchaseBody = @{
    userId = $UserId
    packageId = $PackageId
    paymentProvider = "stripe"
    paymentMethod = "credit_card"
} | ConvertTo-Json

Write-Host "Invoking purchase-credits..."
supabase functions invoke purchase-credits --project-ref zfryjwaeojccskfiibtq \
  --body $purchaseBody \
  --header "Authorization: Bearer $env:SUPABASE_ACCESS_TOKEN" \
  --header "Content-Type: application/json" | Write-Host

# Simular webhook Stripe (checkout.session.completed)
$webhookBody = Get-Content "scripts/stripe-webhook-sample.json" -Raw

Write-Host "Invoking stripe-webhook..."
supabase functions invoke stripe-webhook --project-ref zfryjwaeojccskfiibtq \
  --body $webhookBody \
  --header "Content-Type: application/json" | Write-Host 
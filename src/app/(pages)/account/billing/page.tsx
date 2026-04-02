"use client"

import BillingCurrentPlan from "@/front/components/Private/Account/Billing/BillingCurrentPlan"
import BillingHistory from "@/front/components/Private/Account/Billing/BillingHistory"
import BillingPaymentMethods from "@/front/components/Private/Account/Billing/BillingPaymentMethods"
import BillingPlans from "@/front/components/Private/Account/Billing/BillingPlans"

export default function BillingSection() {
    return (
        <div className="flex flex-col gap-2">
            <BillingCurrentPlan />
            <BillingPlans />
            <BillingPaymentMethods />
            <BillingHistory />
        </div>
    )
}

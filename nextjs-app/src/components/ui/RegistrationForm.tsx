"use client";

import { useState, FormEvent, ChangeEvent } from "react";

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwXIhOpb0zHsm4NT_gGBO224IT6p8pJUueSXZabLVoQxpSnz3AXr3WYe0HLCo6IMMpl/exec";

export function RegistrationForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);

  // Phone number auto-formatting
  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 3 && value.length <= 7) {
      value = value.slice(0, 3) + "-" + value.slice(3);
    } else if (value.length > 7) {
      value =
        value.slice(0, 3) + "-" + value.slice(3, 7) + "-" + value.slice(7, 11);
    }
    setFormData({ ...formData, phone: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      setIsSuccess(true);
      console.log("Registration sent:", formData);
    } catch (error) {
      console.error("Error saving registration:", error);
      alert("등록 중 오류가 발생했습니다. 다시 시도해주세요.");
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-green-500/20 backdrop-blur-md rounded-2xl p-8 border border-green-500/50 text-center">
        <span
          className="material-icons-outlined text-green-400 mb-4"
          style={{ fontSize: 64 }}
        >
          check_circle
        </span>
        <h3 className="text-2xl font-bold text-white mb-2">
          등록이 완료되었습니다!
        </h3>
        <p className="text-stone-300">출시 소식을 가장 먼저 알려드릴게요.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-stone-800/50 backdrop-blur-md rounded-2xl p-8 border border-stone-700"
    >
      <div className="space-y-6">
        {/* Name Field */}
        <div>
          <label
            htmlFor="userName"
            className="block text-sm font-medium text-stone-300 mb-2"
          >
            <span className="flex items-center gap-2">
              <span className="material-icons-outlined" style={{ fontSize: 18 }}>
                person
              </span>
              이름
            </span>
          </label>
          <input
            type="text"
            id="userName"
            name="name"
            required
            placeholder="홍길동"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 bg-stone-900/50 border border-stone-600 rounded-lg text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="userEmail"
            className="block text-sm font-medium text-stone-300 mb-2"
          >
            <span className="flex items-center gap-2">
              <span className="material-icons-outlined" style={{ fontSize: 18 }}>
                email
              </span>
              이메일
            </span>
          </label>
          <input
            type="email"
            id="userEmail"
            name="email"
            required
            placeholder="example@email.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-4 py-3 bg-stone-900/50 border border-stone-600 rounded-lg text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Phone Field */}
        <div>
          <label
            htmlFor="userPhone"
            className="block text-sm font-medium text-stone-300 mb-2"
          >
            <span className="flex items-center gap-2">
              <span className="material-icons-outlined" style={{ fontSize: 18 }}>
                phone
              </span>
              연락처
            </span>
          </label>
          <input
            type="tel"
            id="userPhone"
            name="phone"
            required
            placeholder="010-1234-5678"
            pattern="[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}"
            value={formData.phone}
            onChange={handlePhoneChange}
            className="w-full px-4 py-3 bg-stone-900/50 border border-stone-600 rounded-lg text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          />
          <p className="mt-1 text-xs text-stone-500">형식: 010-1234-5678</p>
        </div>

        {/* Privacy Agreement */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="privacyAgree"
            name="privacy"
            required
            checked={privacyAgreed}
            onChange={(e) => setPrivacyAgreed(e.target.checked)}
            className="mt-1 w-4 h-4 text-green-500 bg-stone-900 border-stone-600 rounded focus:ring-green-500 focus:ring-2"
          />
          <label htmlFor="privacyAgree" className="text-sm text-stone-400">
            <a href="#" className="text-green-400 hover:underline">
              개인정보 처리방침
            </a>
            에 동의합니다. 수집된 정보는 서비스 안내 목적으로만 사용됩니다.
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              처리 중...
            </>
          ) : (
            <>
              <span className="material-icons-outlined">send</span>
              사전 등록하기
            </>
          )}
        </button>
      </div>
    </form>
  );
}

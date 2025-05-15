const BASE_URL = "http://localhost:8080";
const TEST_MODE = true; // 실서버 테스트용. 테스트 시 true로 변경

function goToPage(page) {
  window.location.href = page;
}

function getEmailFromQuery() {
  return new URLSearchParams(window.location.search).get("email");
}

function validatePassword(pw) {
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(pw);
}

async function postJSON(endpoint, data) {
  if (TEST_MODE) {
    if (endpoint.includes("check-email")) {
      return { available: data.email !== "taken@example.com" };
    }
    if (endpoint.includes("login")) {
      return data.email === "user@example.com" && data.password === "test1234"
        ? { success: true }
        : { success: false, message: "이메일 또는 비밀번호가 틀렸습니다." };
    }
    if (endpoint.includes("save-profile")) {
      return {
        success: data.name !== "",
        message: data.name ? "프로필 저장 완료" : "입력값이 유효하지 않습니다."
      };
    }
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return await response.json();
}

async function checkEmailAvailability(email) {
  const result = await postJSON("/check-email", { email });
  return result?.available;
}

async function verifyEmailRequest(email) {
  if (TEST_MODE) {
    return { success: email === "verified@example.com" };
  }

  const res = await fetch(`${BASE_URL}/verify-email?email=${encodeURIComponent(email)}`);
  return await res.json();
}

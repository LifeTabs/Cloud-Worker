const response_failed = (code, message) => {
  return {
    status: false,
    error: {
      code,
      message,
    }
  }
}

const response_success = (data) => {
  return {
    status: true,
    data,
  }
}

export {
  response_failed,
  response_success,
}
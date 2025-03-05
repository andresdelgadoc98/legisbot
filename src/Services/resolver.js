import axios from "axios";
import config from "../config/config";

export async function resolve(promise) {
  const resolved = {
    data: null,
    error: null,
  };

  try {
    let response = await promise;

    if (response.status === 401) {
    }

    resolved.data = response.data;
  } catch (error) {
    resolved.error = error;
  }

  return resolved;
}

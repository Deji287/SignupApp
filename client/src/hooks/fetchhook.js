import axios from "axios";
import { useEffect, useState } from "react";
import { getUsername } from "../helper/helper";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

// custom hook
export default function useFetch(query) {
  const [getData, setGetData] = useState({
    isLoading: false,
    apiData: undefined,
    status: null,
    serverError: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setGetData((prev) => ({ ...prev, isLoading: true }));

        const { username } = !query ? await getUsername() : "";

        const { data, status } = !query
          ? await axios.get(`/api/user/${username}`)
          : await axios.get(`/api/${query}`);

        if (status === 201) {
          setGetData((prev) => ({ ...prev, isLoading: false }));
          setGetData((prev) => ({ ...prev, apiData: data, status: status }));
        }
        setGetData((prev) => ({ ...prev, isLoading: false }));
      } catch (error) {
        setGetData((prev) => ({
          ...prev,
          isLoading: false,
          serverError: error,
        }));
      }
    };
    fetchData();
  }, [query]);
  return [getData, setGetData];
}

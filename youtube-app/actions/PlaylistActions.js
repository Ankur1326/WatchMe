import axios from "axios";
import { useCallback } from "react";
import { base_url } from "../helper/helper";

const [user, setUser] = useContext(UserType);


const getUserPlaylists = useCallback(async () => {
    try {
      const userId = user._id;
      const fetchedPlaylists = await axios.get(`${base_url}/playlist/user/${userId}`)
      // console.log(fetchedPlaylists.data.data);
      setPlaylists(fetchedPlaylists.data.data)
    } catch (error) {
      console.log("error while getting playlist with userID ", error);
    }
  })
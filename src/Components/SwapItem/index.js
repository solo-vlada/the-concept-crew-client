import React, {useState, useEffect} from 'react';
import { getMyListings } from "../../utils/api";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Container from '@mui/material/Container'
import {PersonalLightbox} from "../../Components"
import Paper from "@mui/material/Paper"
import Button from '@mui/material/Button'
import Box from "@mui/material/Box"
import {Link } from 'react-router-dom'
import { Typography } from '@mui/material';
import { useNavigate } from "react-router-dom";
import axios from 'axios';


export default function SwapItem({receiverId, receiverItemId}) {
  const [itemData, setItemData] = useState([]);
  const [clickedImg, setClickedImg] = useState(false);
//   const [currentIndex, setCurrentIndex] = useState(null);
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [size, setSize] = useState('');
  const [id, setId] = useState('')
  const stored_user_id = localStorage.getItem("shopping-user-id");
  const navigate = useNavigate();
  const api_url = "https://concept-crew-server.herokuapp.com/auth/create-swap";

  const clientTokens = localStorage.getItem("shopping-access-token");

//Get data 
useEffect(() => {
  getMyListings(stored_user_id).then((listingsFromApi) => {
    console.log(listingsFromApi)
    setItemData(listingsFromApi);
  });
}, []);

  //Handle lightboxes
  const lightBoxHandler = (item, index) => {
    // setCurrentIndex(index);
    // setClickedImg(item.images);
    // setTitle(item.item_name)
    // setDescription(item.description)
    // setSize(item.size)
    setId(item.id)
    setClickedImg(true)
    
    console.log(id)
  }

  function handleSubmit (e) {
        e.preventDefault();
        const options = {
            method: "POST",
            url: api_url,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "x-access-tokens": clientTokens,
            },
            data: {
                proposer_item_id: id,
                receiver_item_id: receiverItemId,
                receiver: receiverId
            },
          };
          console.log(options.data);
          axios
            .request(options)
            .then(function (response) {
              console.log(response.data);
            })
            .catch(function (error) {
              console.error(error);
            });
            navigate("/messages")
  }


const style = {
    position: 'absolute',
    display: 'flex',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'auto',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };


  return (
    <Paper sx={style}>
            <Box sx={{display: "flex", flexDirection:"column"}}>
            <Typography sx={{mb:2, alignSelf: 'center',  border: '1px solid #000', p:1 }} component='h4' variant='h6'> Choose item to swap</Typography>
            <ImageList variant="masonry" cols={2} gap={10} sx={{ m:1, 
            gridTemplateColumns:
            'repeat(auto-fill, minmax(300px, 1fr)!important'
        }}>
            {itemData.map((item, index) => (
            <>
             <ImageListItem
                 sx = 
                 {{height: '250px!important',
                  width: 'auto',
                  }} key={index} >
                <img
                key={item.id}
                src={`${item.images}?w=248&fit=crop&auto=format`}
                srcSet={`${item.images}?w=248&fit=crop&auto=format&dpr=2 2x`}
                alt={item.item_name}
                loading="lazy"
                onClick={() => {
                    lightBoxHandler(item, index);
                }}
                />
            <ImageListItemBar position="below" title={item.item_name} />
            </ImageListItem>
            </>
            ))}
        </ImageList>
        <Button type="button" variant='contained'  sx={{alignSelf: 'center', mt:2 }}onClick={handleSubmit}>Next</Button>
        </Box>
    </Paper>
  
  );
}

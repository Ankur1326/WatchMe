import { View, Text, TextInput, FlatList, Pressable, Image, Alert, Modal, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import axios from "axios";
import { base_url } from '../helper/helper';
import AsyncStorage from "@react-native-async-storage/async-storage"
import { formatDistanceToNow } from 'date-fns';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from "@expo/vector-icons";
import { Ionicons } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import axiosInstance from '../helper/axiosInstance';

const CommentComponent = ({ videoId }) => {
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [isVisible, setVisible] = useState(false);
    const [commentLength, setCommentLength] = useState(0);
    const [isEditTextVisible, setEditTextVisible] = useState(false)
    const [selectedComment, setSelectedComment] = useState({})
    const [showAllComments, setShowAllComments] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        setComment(selectedComment.content || "")
    }, [selectedComment])

    const getVideoCommentsHandler = async () => {
        try {
            const response = await axiosInstance.get(`comments/${videoId}`)

            setCommentLength(response.data.data.commentsLength)
            setComments(response.data.data.getTenVideoComments)
        } catch (error) {
            console.log("error while fetching all video comments ");
        }
    }
    useEffect(() => {
        getVideoCommentsHandler()
    }, [])

    const addComment = async () => {
        try {
            const response = await axiosInstance.post(`comments/${videoId}`, { content: comment })
            if (response) {
                getVideoCommentsHandler() // refresh comment list
            }
            setComment("")
        } catch (error) {
            console.log("error while adding comment");
            Alert.alert([
                "Error",
                "Comment not added"
            ])
        }
    }

    const modalLogic = (item) => {
        setVisible(true)
        console.log("item  ", item);
        setSelectedComment(item)
    }

    const editComment = () => {
        setEditTextVisible(true)
    }

    // auto focus 
    useEffect(() => {
        if (ref.current && isEditTextVisible) {
            ref.current.focus();
        }
    }, [isEditTextVisible]);

    // function to edit comment handler
    const editCommentHandler = async () => {
        const commentId = selectedComment._id
        try {
            const response = await axiosInstance.patch(`comments/c/${commentId}`, { content: comment })

            if (response) {
                setVisible(false)
                setComment("")
                setEditTextVisible(false)
                getVideoCommentsHandler() // refresh comment list
            }
        } catch (error) {
            console.log("error while updating comment", error);
        } finally {
            setVisible(false)
            setComment('')
            setEditTextVisible(false)
        }
    }

    // function to delete comment 
    const deleteCommentHandler = async () => {
        const commentId = selectedComment?._id
        try {
            const response = await axiosInstance.delete(`comments/c/${commentId}`)
            if (response) {
                getVideoCommentsHandler() // refresh comment list
                setVisible(false)
            }
        } catch (error) {
            console.log("error while deleting comment", error);
        } finally {
            setVisible(false)
        }
    }

    const closeModal = () => {
        setVisible(false)
        setEditTextVisible(false)
    }

    // handle like or dislike 
    const toggleCommentLikeHandler = async (commentId, action) => {
        try {
            await axiosInstance.post(`likes/toggle/c/${commentId}`, { action })
            getVideoCommentsHandler()
        } catch (error) {
            console.log("Error while toggle comment likes ", error);
        }
    }

    return (
        <View style={{ marginTop: 20, position: "relative" }}>

            {/* Show only one comment initially */}
            <TouchableOpacity onPress={() => setShowAllComments(!showAllComments)} style={{ flexDirection: "column", gap: 10, borderWidth: 0.2, borderColor: "white", paddingVertical: 15, paddingHorizontal: 7, backgroundColor: "#222", borderRadius: 5, marginBottom: 25 }}>
                <Text style={{ color: "white" }}>Comments {commentLength}</Text>
                <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                    <Image source={{ uri: comments[0]?.userDetails[0]?.avatar }} style={{ width: 30, height: 30, borderRadius: 25 }} />
                    <Text style={{ color: "white", width: "90%" }}>{comments[0]?.content}</Text>
                </View>
            </TouchableOpacity>

            {
                showAllComments &&
                <Modal
                    // onBackdropPress={() => test()}
                    animationType='slide'
                    transparent={true}
                    visible={showAllComments}
                    onRequestClose={() => setShowAllComments(false)}
                >
                    <View style={{ height: 400, flex: 1, justifyContent: 'flex-end', paddingHorizontal: 10 }} >
                        <View style={{ height: "60%", backgroundColor: "#000", borderTopRightRadius: 10, borderTopLeftRadius: 10, paddingHorizontal: 10 }} >

                            <View style={{ flexDirection: "row", justifyContent: "flex-end", paddingHorizontal: 15, paddingVertical: 10, borderBottomWidth: 0.4, borderBottomColor: "white" }} >

                                <TouchableOpacity onPress={() => setShowAllComments(false)} >
                                    <EvilIcons name="close" size={29} color="white" />
                                </TouchableOpacity>
                            </View>
                            {// show when EditTextVisible not show
                                isEditTextVisible != true &&
                                <View style={{ flexDirection: "row", borderWidth: 0.6, borderColor: "white", borderRadius: 15, position: "relative", marginTop: 10 }} >
                                    <TextInput onChangeText={(text) => setComment(text)} placeholder='Add a Comment' placeholderTextColor="white" style={[{ color: "white", paddingHorizontal: 15, paddingVertical: 4, }, comment && { paddingRight: 60 }]} />

                                    {
                                        comment && <TouchableOpacity onPress={addComment} style={{ position: "absolute", right: 0, borderLeftWidth: 1, borderColor: "white", paddingHorizontal: 10, paddingVertical: 5, width: 60 }}>
                                            {/* TODO add right arrow  */}
                                            <Ionicons name="send" size={24} color="white" />
                                        </TouchableOpacity>
                                    }
                                </View>
                            }

                            <View style={{ marginVertical: 15 }}>
                                {
                                    <FlatList
                                        data={comments}
                                        renderItem={({ item }) => (
                                            <View style={{ paddingHorizontal: 0, flexDirection: 'column', gap: 10, paddingVertical: 15, borderTopWidth: 1, borderTopColor: "gray" }}>

                                                <View style={{ flexDirection: 'row', gap: 15 }}>
                                                    <Pressable style={{ flexDirection: 'row', gap: 15 }}>
                                                        <Image source={{ uri: item.userDetails[0]?.avatar }} style={{ width: 40, height: 40, borderRadius: 25 }} />
                                                    </Pressable>

                                                    <View style={{ flexDirection: "column", gap: 10 }}>
                                                        <View style={{}}>
                                                            <View style={{ flexDirection: 'row', gap: 5 }}>
                                                                <Text style={{ color: "white" }}>{item?.userDetails[0]?.fullName} {" "}•</Text>


                                                                <Text style={{ color: "white" }}>
                                                                    {
                                                                        formatDistanceToNow(new Date(item.createdAt), {
                                                                            addSuffix: true,
                                                                        }).toString()
                                                                    }
                                                                </Text>
                                                            </View>

                                                            <Text style={{ color: "white" }}>@{item?.userDetails[0]?.username}</Text>
                                                        </View>

                                                        {/* content */}
                                                        <View style={{ width: "90%", }}>
                                                            <Text style={{ color: "white" }} >{item.content}</Text>
                                                        </View>

                                                        {/* like & dislike */}
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                                                            <TouchableOpacity onPress={() => toggleCommentLikeHandler(item._id, "like")} style={{ flexDirection: 'row', gap: 5 }}>
                                                                <AntDesign name={item.isLiked ? "like1" : "like2"} size={17} color="white" />
                                                                <Text style={{ color: "white", fontSize: 13 }}>{item?.likesCount}</Text>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={() => toggleCommentLikeHandler(item._id, "dislike")} style={{ flexDirection: 'row', gap: 5 }}>
                                                                <AntDesign name={item?.isDisliked ? "dislike1" : "dislike2"} size={17} color="white" />
                                                                <Text style={{ color: "white", fontSize: 13 }}>{item?.dislikesCount}</Text>
                                                            </TouchableOpacity>
                                                        </View>

                                                    </View>



                                                    {/* three dots */}
                                                    <Pressable onPress={() => modalLogic(item)} style={[{ borderColor: "white", paddingHorizontal: 7, paddingVertical: 7, borderRadius: 0, borderBottomWidth: 0, position: "absolute", right: 5 }]}>
                                                        <MaterialCommunityIcons name="dots-vertical" size={24} color="white" />
                                                    </Pressable>
                                                </View>

                                                {/* Bottom modal  */}
                                                <Modal
                                                    animationType='slide'
                                                    transparent={true}
                                                    visible={isVisible}
                                                >

                                                    <View style={{ width: "95%", flex: 1, alignSelf: 'center', justifyContent: 'flex-end', }}>
                                                        <View style={{ backgroundColor: "#111", flex: 1 / 4, alignItems: 'flex-end', justifyContent: 'flex-end', marginBottom: 15, width: "95%", alignSelf: 'center', borderRadius: 15, paddingBottom: 10, position: "relative" }}>

                                                            {/* Edit Input text */}
                                                            {
                                                                isEditTextVisible &&
                                                                <View style={{ flexDirection: "row", borderWidth: 0.6, borderColor: "white", borderRadius: 5, position: "absolute", top: -40, width: "100%", backgroundColor: "#222" }} >
                                                                    <TextInput ref={ref} value={comment} onChangeText={(text) => setComment(text)} placeholder='Add a Comment' placeholderTextColor="white" style={[{ color: "white", paddingHorizontal: 15, paddingVertical: 4, }, comment && { paddingRight: 60 }]} />

                                                                    {
                                                                        comment && <Pressable onPress={() => editCommentHandler()} style={{ position: "absolute", right: 0, borderLeftWidth: 1, borderColor: "white", paddingHorizontal: 10, paddingVertical: 5, width: 60 }}>
                                                                            {/* TODO add right arrow  */}
                                                                            <Ionicons name="send" size={24} color="white" />
                                                                        </Pressable>
                                                                    }
                                                                </View>
                                                            }


                                                            {/* hide modal btn */}
                                                            <TouchableOpacity onPress={() => closeModal()} style={{ position: 'absolute', zIndex: 99, right: 10, top: 10 }} >
                                                                <Entypo name="cross" size={34} color="white" />
                                                            </TouchableOpacity>


                                                            {/* Edit btn     */}
                                                            <TouchableOpacity onPress={() => editComment()} style={{ backgroundColor: "", width: "100%", borderBottomWidth: 0.5, borderColor: "gray", paddingVertical: 15, flexDirection: 'row', gap: 20, paddingHorizontal: 20, alignItems: 'center' }}>
                                                                <Feather name="edit" size={24} color="white" />
                                                                <Text style={{ fontSize: 18, fontWeight: 'bold', color: "white" }} >Edit</Text>
                                                            </TouchableOpacity>
                                                            {/* delete btn */}
                                                            <TouchableOpacity onPress={() => deleteCommentHandler()} style={{ backgroundColor: "", width: "100%", borderBottomWidth: 0.5, borderColor: "gray", paddingVertical: 15, flexDirection: 'row', gap: 20, paddingHorizontal: 20, alignItems: 'center' }}>
                                                                <AntDesign name="delete" size={24} color="white" />
                                                                <Text style={{ fontSize: 18, fontWeight: 'bold', color: "white" }} >Delete</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                </Modal>
                                            </View>
                                        )}
                                    />
                                }
                            </View>
                        </View>
                    </View>
                </Modal>
            }

        </View >
    )
}

export default CommentComponent
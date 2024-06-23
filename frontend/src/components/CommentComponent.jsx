import { View, Text, TextInput, FlatList, Pressable, Image, Alert, Modal, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState, useRef, memo } from 'react'
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
        <View style={styles.container}>
            <TouchableOpacity onPress={() => setShowAllComments(!showAllComments)} style={styles.commentContainer}>
                <Text style={styles.commentHeaderText}>Comments {commentLength}</Text>
                <View style={styles.initialCommentContent}>
                    <Image source={{ uri: comments[0]?.userDetails[0]?.avatar }} style={styles.commentAvatar} />
                    <Text style={styles.commentText}>{comments[0]?.content}</Text>
                </View>
            </TouchableOpacity>

            {
                showAllComments &&
                <Modal
                    animationType='slide'
                    transparent={true}
                    visible={showAllComments}
                    onRequestClose={() => setShowAllComments(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <TouchableOpacity onPress={() => setShowAllComments(false)}>
                                    <EvilIcons name="close" size={29} color="white" />
                                </TouchableOpacity>
                            </View>

                            {
                                !isEditTextVisible &&
                                <View style={styles.commentInputContainer}>
                                    <TextInput
                                        onChangeText={(text) => setComment(text)}
                                        placeholder='Add a Comment'
                                        placeholderTextColor="white"
                                        style={[styles.commentInput, comment && styles.commentInputWithButton]}
                                    />

                                    {comment &&
                                        <TouchableOpacity onPress={addComment} style={styles.sendButton}>
                                            <Ionicons name="send" size={24} color="white" />
                                        </TouchableOpacity>
                                    }
                                </View>
                            }

                            <View style={styles.commentListContainer}>
                                <FlatList
                                    data={comments}
                                    renderItem={({ item }) => (
                                        <View style={styles.singleCommentContainer}>
                                            <View style={styles.commentUserInfo}>
                                                <Image source={{ uri: item.userDetails[0]?.avatar }} style={styles.commentUserAvatar} />
                                                <View style={styles.commentDetails}>
                                                    <View style={styles.commentDetailRow}>
                                                        <Text style={styles.commentUsername}>@{item?.userDetails[0]?.username}</Text>
                                                        {/* <Text style={styles.commentUsername}>{item?.userDetails[0]?.fullName} •</Text> */}
                                                        <Text style={styles.commentTimestamp}>
                                                            {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true }).toString()}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>

                                            <View style={styles.commentContent}>
                                                <Text style={styles.commentText}>{item.content}</Text>
                                                <View style={styles.commentActions}>
                                                    <TouchableOpacity onPress={() => toggleCommentLikeHandler(item._id, "like")} style={styles.commentAction}>
                                                        <AntDesign name={item.isLiked ? "like1" : "like2"} size={17} color="white" />
                                                        <Text style={styles.commentActionText}>{item?.likesCount}</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={() => toggleCommentLikeHandler(item._id, "dislike")} style={styles.commentAction}>
                                                        <AntDesign name={item?.isDisliked ? "dislike1" : "dislike2"} size={17} color="white" />
                                                        <Text style={styles.commentActionText}>{item?.dislikesCount}</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>

                                            <Pressable onPress={() => modalLogic(item)} style={styles.moreOptionsButton}>
                                                <MaterialCommunityIcons name="dots-vertical" size={24} color="white" />
                                            </Pressable>

                                            {/* Bottom modal */}
                                            <Modal
                                                animationType='slide'
                                                transparent={true}
                                                visible={isVisible}
                                            >
                                                <View style={styles.bottomModalContainer}>
                                                    <View style={styles.bottomModalContent}>
                                                        {isEditTextVisible &&
                                                            <View style={styles.commentInputContainer}>
                                                                <TextInput
                                                                    value={comment}
                                                                    onChangeText={(text) => setComment(text)}
                                                                    placeholder='Add a Comment'
                                                                    placeholderTextColor="white"
                                                                    style={[styles.commentInput, comment && styles.commentInputWithButton]}
                                                                />
                                                                {comment &&
                                                                    <Pressable onPress={() => editCommentHandler()} style={styles.sendButton}>
                                                                        <Ionicons name="send" size={24} color="white" />
                                                                    </Pressable>
                                                                }
                                                            </View>
                                                        }

                                                        <TouchableOpacity onPress={() => closeModal()} style={styles.closeModalButton}>
                                                            <Entypo name="cross" size={34} color="white" />
                                                        </TouchableOpacity>

                                                        <TouchableOpacity onPress={() => editComment()} style={styles.modalButton}>
                                                            <Feather name="edit" size={24} color="white" />
                                                            <Text style={styles.modalButtonText}>Edit</Text>
                                                        </TouchableOpacity>

                                                        <TouchableOpacity onPress={() => deleteCommentHandler()} style={styles.modalButton}>
                                                            <AntDesign name="delete" size={24} color="white" />
                                                            <Text style={styles.modalButtonText}>Delete</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </Modal>
                                        </View>
                                    )}
                                />
                            </View>
                        </View>
                    </View>
                </Modal>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        position: "relative",
    },
    commentContainer: {
        flexDirection: "column",
        gap: 10,
        borderWidth: 0.2,
        borderColor: "white",
        paddingVertical: 15,
        paddingHorizontal: 25,
        backgroundColor: "#222",
        borderRadius: 5,
        marginBottom: 25,
    },
    commentHeaderText: {
        color: "white",
    },
    initialCommentContent: {
        flexDirection: "row",
        gap: 10,
        // marginLeft: 60,
        alignItems: "center",
    },
    commentContent: {
        // flexDirection: "row",
        gap: 10,
        marginLeft: 60,
        // alignItems: "center",
    },
    commentAvatar: {
        width: 30,
        height: 30,
        borderRadius: 25,
    },
    commentText: {
        color: "white",
        width: "90%",
    },
    modalContainer: {
        height: 400,
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 10,
    },
    modalContent: {
        height: "60%",
        backgroundColor: "#000",
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        paddingHorizontal: 10,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 0.4,
        borderBottomColor: "white",
    },
    commentInputContainer: {
        flexDirection: "row",
        borderWidth: 0.6,
        borderColor: "white",
        borderRadius: 15,
        position: "relative",
        marginTop: 10,
    },
    commentInput: {
        color: "white",
        paddingHorizontal: 15,
        paddingVertical: 4,
    },
    commentInputWithButton: {
        paddingRight: 60,
    },
    sendButton: {
        position: "absolute",
        right: 0,
        borderLeftWidth: 1,
        borderColor: "white",
        paddingHorizontal: 10,
        paddingVertical: 5,
        width: 60,
    },
    commentListContainer: {
        marginVertical: 15,
        marginBottom: 90
    },
    singleCommentContainer: {
        paddingHorizontal: 0,
        flexDirection: 'column',
        gap: 0,
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: "gray",
    },
    commentUserInfo: {
        flexDirection: 'row',
        gap: 15,
    },
    commentUserAvatar: {
        width: 40,
        height: 40,
        borderRadius: 25,
    },
    commentDetails: {
        flexDirection: "column",
        gap: 10,
    },
    commentDetailRow: {
        flexDirection: 'row',
        gap: 5,
    },
    commentUsername: {
        color: "white",
    },
    commentTimestamp: {
        color: "white",
    },
    commentActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    commentAction: {
        flexDirection: 'row',
        gap: 5,
    },
    commentActionText: {
        color: "white",
        fontSize: 13,
    },
    moreOptionsButton: {
        borderColor: "white",
        paddingHorizontal: 7,
        paddingVertical: 7,
        borderRadius: 0,
        borderBottomWidth: 0,
        position: "absolute",
        right: 5,
    },
    bottomModalContainer: {
        width: "95%",
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'flex-end',
    },
    bottomModalContent: {
        backgroundColor: "#111",
        flex: 1 / 4,
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        marginBottom: 15,
        width: "95%",
        alignSelf: 'center',
        borderRadius: 15,
        paddingBottom: 10,
        position: "relative",
    },
    closeModalButton: {
        position: 'absolute',
        zIndex: 99,
        right: 10,
        top: 10,
    },
    modalButton: {
        backgroundColor: "",
        width: "100%",
        borderBottomWidth: 0.5,
        borderColor: "gray",
        paddingVertical: 15,
        flexDirection: 'row',
        gap: 20,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    modalButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: "white",
    },
});

export default memo(CommentComponent)
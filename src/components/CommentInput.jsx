import { Button, Col, Input, message, Row } from "antd";
import { useState } from "react";
import { projectsStorage } from "../storage/projectsStorage";
import useAuthStore from "../stores/authStore";

function CommentInput({project, setRefresh}) {
    const [content, setContent] = useState('')
    const currentUser = useAuthStore(state => state.currentUser)

    async function addComment() {
        console.log('add comment', content)
        const currentComments = 'comments' in project ? project.comments : []
        currentComments.push({
            author: {
                name: currentUser.name
            },
            content
        })
        const updateProject = await projectsStorage.updateProject(project.id, {
            ...project,
            comments: currentComments
        })
        if(updateProject.status){
            message.success("Comentario agregado exitosamente")
            setContent('')
            setRefresh(true)
        }
    }

    return (
        <Row>
            <Col span={22}>
                <Input value={content} placeholder="Agregar comentario" onChange={(e) => setContent(e.target.value)} />
            </Col>
            <Col span={2}>
                <Button onClick={addComment} type="primary">Guardar</Button>
            </Col>
        </Row>

    )
}

export default CommentInput
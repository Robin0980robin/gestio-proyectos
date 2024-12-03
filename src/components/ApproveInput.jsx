import { Button, Checkbox, Col, Input, message, Row } from "antd";
import { projectsStorage } from "../storage/projectsStorage";

function ApproveInput({ project }) {

    async function handleCheck(e) {
        const checked = e.target.checked
        const updateProject = await projectsStorage.updateProject(project.id, {
            ...project,
            checked
        })

        if (updateProject.status) {
            message.success(checked ? "Avances aprobados exitosamente" : "Avances rechazados exitosamente")
        }
    }

    return (
        <div>
            <span>Aprobar avances</span>
            <Checkbox defaultChecked={'checked' in project ? project.checked : false} onChange={(e) => handleCheck(e)} />
        </div>

    )
}

export default ApproveInput
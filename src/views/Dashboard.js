import React from 'react'
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardText,
  CardLink
} from "reactstrap"

export default function Dashboard() {
  return (
    <div>
    <Card>
      <CardHeader>
        <CardTitle>Dashboard User 🚀</CardTitle>
      </CardHeader>
      <CardBody>
        <CardText>All the best for your new project.</CardText>
        <CardText>
          Please make sure to read our{" "}
         
          to understand where to go from here and how to use our template.
        </CardText>
      </CardBody>
    </Card>

  
  </div>
  )
}

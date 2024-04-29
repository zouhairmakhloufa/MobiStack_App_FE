import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardText,
  CardLink
} from "reactstrap"

const Home = () => {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Kick start your project 🚀</CardTitle>
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

export default Home
